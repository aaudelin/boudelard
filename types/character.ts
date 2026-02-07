export interface AbilityScore {
  value: number;
  modifier: number;
}

export interface Abilities {
  strength: AbilityScore;
  dexterity: AbilityScore;
  constitution: AbilityScore;
  intelligence: AbilityScore;
  wisdom: AbilityScore;
  charisma: AbilityScore;
}

export interface SavingThrow {
  proficient: boolean;
  modifier: number;
}

export interface SavingThrows {
  strength: SavingThrow;
  dexterity: SavingThrow;
  constitution: SavingThrow;
  intelligence: SavingThrow;
  wisdom: SavingThrow;
  charisma: SavingThrow;
}

export interface Skill {
  proficient: boolean;
  modifier: number;
  expertise?: boolean;
}

export interface Skills {
  acrobatics: Skill;
  animalHandling: Skill;
  arcana: Skill;
  athletics: Skill;
  deception: Skill;
  history: Skill;
  insight: Skill;
  intimidation: Skill;
  investigation: Skill;
  medicine: Skill;
  nature: Skill;
  perception: Skill;
  performance: Skill;
  persuasion: Skill;
  religion: Skill;
  sleightOfHand: Skill;
  stealth: Skill;
  survival: Skill;
}

export interface Attack {
  name: string;
  attackBonus: number;
  damage: string;
  damageType: string;
  range?: string;
  properties?: string[];
}

export interface Currency {
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
}

export interface Equipment {
  items: string[];
  currency: Currency;
}

export interface SpellSlot {
  level: number;
  total: number;
  expended: number;
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  ritual?: boolean;
  concentration?: boolean;
}

export interface Spellcasting {
  spellcastingAbility: string;
  spellSaveDC: number;
  spellAttackBonus: number;
  spellSlots: SpellSlot[];
  cantripsKnown: Spell[];
  spellsKnown: Spell[];
  spellsPrepared?: Spell[];
}

export interface Feature {
  name: string;
  source: string;
  description: string;
}

export interface HitPoints {
  maximum: number;
  current: number;
  temporary: number;
  hitDice: string;
  hitDiceRemaining: number;
}

export interface Proficiencies {
  armor: string[];
  weapons: string[];
  tools: string[];
  languages: string[];
}

export interface Character {
  id: string;
  name: string;
  level: number;
  class: string;
  subclass: string;
  race: string;
  background: string;
  alignment: string;
  experiencePoints: number;
  proficiencyBonus: number;
  inspiration: boolean;
  armorClass: number;
  initiative: number;
  speed: number;
  hitPoints: HitPoints;
  abilities: Abilities;
  savingThrows: SavingThrows;
  skills: Skills;
  proficiencies: Proficiencies;
  equipment: Equipment;
  attacks: Attack[];
  featuresAndTraits: Feature[];
  spellcasting?: Spellcasting;
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory?: string;
  appearance?: string;
  image?: string;
}
