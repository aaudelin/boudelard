import { Character } from "@/types/character";
import { AbilityKey, AbilityScores, CombatantSkill } from "@/types/enemy";
import { Badge } from "@/components/ui/badge";
import {
  calculateModifier,
  formatModifier,
  skillLabels,
} from "@/lib/dnd-helpers";
import { cn } from "@/lib/utils";

// Vue condensée pensée pour la table : le MJ demande un jet de
// caractéristique ou de sauvegarde et lit directement le bonus.
// Une ligne de 6 tuiles (mod + JS) et les compétences notables en badges.

export interface CompactAbilityEntry {
  label: string;
  mod: number;
  save: number;
  saveProficient: boolean;
}

const ABILITY_ORDER: { key: AbilityKey; label: string }[] = [
  { key: "str", label: "FOR" },
  { key: "dex", label: "DEX" },
  { key: "con", label: "CON" },
  { key: "int", label: "INT" },
  { key: "wis", label: "SAG" },
  { key: "cha", label: "CHA" },
];

// PNJ/ennemi : sauvegardes maîtrisées explicites, les autres = mod
export function combatantCompactAbilities(
  abilityScores: AbilityScores,
  savingThrows?: Partial<Record<AbilityKey, number>>
): CompactAbilityEntry[] {
  return ABILITY_ORDER.map(({ key, label }) => {
    const mod = calculateModifier(abilityScores[key]);
    const proficientSave = savingThrows?.[key];
    return {
      label,
      mod,
      save: proficientSave ?? mod,
      saveProficient: proficientSave !== undefined,
    };
  });
}

const CHARACTER_ABILITY_KEYS = [
  { key: "strength", label: "FOR" },
  { key: "dexterity", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "wisdom", label: "SAG" },
  { key: "charisma", label: "CHA" },
] as const;

export function characterCompactAbilities(
  character: Character
): CompactAbilityEntry[] {
  return CHARACTER_ABILITY_KEYS.map(({ key, label }) => ({
    label,
    mod: character.abilities[key].modifier,
    save: character.savingThrows[key].modifier,
    saveProficient: character.savingThrows[key].proficient,
  }));
}

// Seules les compétences maîtrisées : l'essentiel pour un jet demandé
// à la volée (les autres = mod de caractéristique, déjà affiché)
export function characterNotableSkills(character: Character): CombatantSkill[] {
  return Object.entries(character.skills)
    .filter(([, skill]) => skill.proficient)
    .map(([key, skill]) => ({
      name: skillLabels[key] ?? key,
      bonus: skill.modifier,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function CompactStats({
  abilities,
  skills,
}: {
  abilities: CompactAbilityEntry[];
  skills: CombatantSkill[];
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-1">
        {abilities.map((ability) => (
          <div
            key={ability.label}
            className="flex flex-col items-center rounded-md border py-1"
          >
            <span className="text-[10px] font-medium text-muted-foreground">
              {ability.label}
            </span>
            <span className="font-mono text-sm font-bold">
              {formatModifier(ability.mod)}
            </span>
            <span
              className={cn(
                "font-mono text-[10px]",
                ability.saveProficient
                  ? "font-semibold text-primary"
                  : "text-muted-foreground"
              )}
              title="Jet de sauvegarde"
            >
              JS {formatModifier(ability.save)}
            </span>
          </div>
        ))}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skills.map((skill) => (
            <Badge
              key={skill.name}
              variant="secondary"
              className="gap-1 text-xs font-normal"
            >
              {skill.name}
              <span className="font-mono font-semibold">
                {formatModifier(skill.bonus)}
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
