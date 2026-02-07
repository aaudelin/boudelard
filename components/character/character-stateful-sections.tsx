"use client";

import { useCharacterState } from "./character-state-wrapper";
import { CombatStats } from "./combat-stats";
import { SpellcastingSection } from "./spellcasting-section";
import { MoneySection } from "./money-section";
import { Character } from "@/types/character";

interface CombatStatsSectionProps {
  armorClass: number;
  passivePerception: number;
  initiative: number;
  speed: number;
  proficiencyBonus: number;
}

export function StatefulCombatStats({
  armorClass,
  passivePerception,
  initiative,
  speed,
  proficiencyBonus,
}: CombatStatsSectionProps) {
  const { hitPoints, onHitPointsChange } = useCharacterState();

  return (
    <CombatStats
      armorClass={armorClass}
      passivePerception={passivePerception}
      initiative={initiative}
      speed={speed}
      hitPoints={hitPoints}
      proficiencyBonus={proficiencyBonus}
      onHitPointsChange={onHitPointsChange}
    />
  );
}

interface StatefulSpellcastingSectionProps {
  spellcasting: Character["spellcasting"];
}

export function StatefulSpellcastingSection({
  spellcasting,
}: StatefulSpellcastingSectionProps) {
  const { spellSlots, onSpellSlotsChange } = useCharacterState();

  if (!spellcasting) return null;

  return (
    <SpellcastingSection
      spellcasting={spellcasting}
      spellSlots={spellSlots}
      onSpellSlotsChange={onSpellSlotsChange}
    />
  );
}

export function StatefulMoneySection() {
  const { gold, silver, onMoneyChange } = useCharacterState();

  return <MoneySection gold={gold} silver={silver} onMoneyChange={onMoneyChange} />;
}
