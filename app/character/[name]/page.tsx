import { notFound } from "next/navigation";
import Link from "next/link";
import { getCharacterBySlug, getAllCharacterSlugs } from "@/lib/characters";
import { CharacterHeader } from "@/components/character/character-header";
import { AbilityScores } from "@/components/character/ability-scores";
import { CombatStats } from "@/components/character/combat-stats";
import { SavingThrows } from "@/components/character/saving-throws";
import { SkillsList } from "@/components/character/skills-list";
import { Proficiencies } from "@/components/character/proficiencies";
import { EquipmentList } from "@/components/character/equipment-list";
import { AttacksSection } from "@/components/character/attacks-section";
import { FeaturesTraits } from "@/components/character/features-traits";
import { SpellcastingSection } from "@/components/character/spellcasting-section";
import { MoneySection } from "@/components/character/money-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";

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
  const character = await getCharacterBySlug(name);

  if (!character) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="space-y-4">
          <CharacterHeader character={character} />
          <CombatStats character={character} />
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
                    {character.spellcasting && (
                      <SpellcastingSection
                        spellcasting={character.spellcasting}
                      />
                    )}
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
                  <FeaturesTraits features={character.featuresAndTraits} />
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
          </Accordion>

          <MoneySection
            characterId={character.id}
            initialGold={character.equipment.currency.gold}
            initialSilver={character.equipment.currency.silver}
          />
        </div>
      </div>
    </div>
  );
}
