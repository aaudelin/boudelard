import { notFound } from "next/navigation";
import { getCharacterBySlug, getAllCharacterSlugs } from "@/lib/characters";
import {
  initializeCharacterState,
  mergeCharacterWithState,
} from "@/lib/character-state";
import { getCharacterNotes } from "@/lib/character-notes";
import { CharacterHeader } from "@/components/character/character-header";
import { AbilityScores } from "@/components/character/ability-scores";
import { SavingThrows } from "@/components/character/saving-throws";
import { SkillsList } from "@/components/character/skills-list";
import { Proficiencies } from "@/components/character/proficiencies";
import { EquipmentList } from "@/components/character/equipment-list";
import { AttacksSection } from "@/components/character/attacks-section";
import { RestActions } from "@/components/character/rest-actions";
import { CharacterStateWrapper } from "@/components/character/character-state-wrapper";
import {
  StatefulCombatStats,
  StatefulSpellcastingSection,
  StatefulMoneySection,
  StatefulFeaturesTraits,
} from "@/components/character/character-stateful-sections";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Force dynamic rendering to always fetch fresh state from Redis
export const dynamic = "force-dynamic";

interface CharacterPageProps {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCharacterSlugs();
  return slugs.map((name) => ({ name }));
}

export async function generateMetadata({ params }: CharacterPageProps) {
  const { name } = await params;
  const character = await getCharacterBySlug(name);

  if (!character) {
    return { title: "Personnage non trouvé" };
  }

  return {
    title: `${character.name} - Fiche de personnage`,
    description: `Fiche de personnage D&D 5e pour ${character.name}, ${character.race} ${character.class} niveau ${character.level}`,
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { name } = await params;
  const staticCharacter = await getCharacterBySlug(name);

  if (!staticCharacter) {
    notFound();
  }

  // Get dynamic state from Redis (or initialize from static data),
  // reconciled with the JSON in case slot levels changed
  const state = await initializeCharacterState(staticCharacter);

  // Merge static character data with dynamic state
  const character = mergeCharacterWithState(staticCharacter, state);

  // Free-form notes stored in their own Redis key
  const notes = await getCharacterNotes(character.id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="space-y-4">
          <CharacterHeader character={character} />

          <CharacterStateWrapper
            characterId={character.id}
            initialHitPoints={character.hitPoints}
            initialGold={character.equipment.currency.gold}
            initialSilver={character.equipment.currency.silver}
            initialSpellSlots={character.spellcasting?.spellSlots ?? []}
            initialFeatureUses={state.featureUses}
          >
            <RestActions
              characterId={character.id}
              characterClass={character.class}
              initialNotes={notes}
            />

            <StatefulCombatStats
              armorClass={character.armorClass}
              passivePerception={character.passivePerception}
              initiative={character.initiative}
              speed={character.speed}
              proficiencyBonus={character.proficiencyBonus}
            />
            <AbilityScores abilities={character.abilities} />

            <Accordion
              type="multiple"
              defaultValue={["attacks", "spells", "saves-skills"]}
              className="space-y-4"
            >
              <AccordionItem value="attacks" className="border-none">
                <div className="rounded-lg border bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-lg font-semibold">
                      Attaques et Sorts
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      <AttacksSection attacks={character.attacks} />
                      <StatefulSpellcastingSection
                        spellcasting={character.spellcasting}
                      />
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>

              <AccordionItem value="saves-skills" className="border-none">
                <div className="rounded-lg border bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-lg font-semibold">
                      Jets de sauvegarde et Compétences
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      <SavingThrows savingThrows={character.savingThrows} />
                      <SkillsList skills={character.skills} />
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>

              <AccordionItem value="features" className="border-none">
                <div className="rounded-lg border bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-lg font-semibold">Capacités</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <StatefulFeaturesTraits
                      features={character.featuresAndTraits}
                    />
                  </AccordionContent>
                </div>
              </AccordionItem>

              <AccordionItem value="equipment" className="border-none">
                <div className="rounded-lg border bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-lg font-semibold">Équipement</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      <EquipmentList equipment={character.equipment} />
                      <Proficiencies proficiencies={character.proficiencies} />
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
              <AccordionItem value="money" className="border-none">
                <div className="rounded-lg border bg-card">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-lg font-semibold">Bourse</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <StatefulMoneySection />
                  </AccordionContent>
                </div>
              </AccordionItem>
            </Accordion>
          </CharacterStateWrapper>
        </div>
      </div>
    </div>
  );
}
