export function formatModifier(modifier: number): string {
  if (modifier >= 0) {
    return `+${modifier}`;
  }
  return `${modifier}`;
}

export function calculateModifier(abilityScore: number): number {
  return Math.floor((abilityScore - 10) / 2);
}

export const abilityLabels: Record<string, string> = {
  strength: "Force",
  dexterity: "Dextérité",
  constitution: "Constitution",
  intelligence: "Intelligence",
  wisdom: "Sagesse",
  charisma: "Charisme",
};

export const abilityAbbreviations: Record<string, string> = {
  strength: "FOR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "SAG",
  charisma: "CHA",
};

export const skillLabels: Record<string, string> = {
  acrobatics: "Acrobatie",
  animalHandling: "Dressage",
  arcana: "Arcanes",
  athletics: "Athlétisme",
  deception: "Tromperie",
  history: "Histoire",
  insight: "Perspicacité",
  intimidation: "Intimidation",
  investigation: "Investigation",
  medicine: "Médecine",
  nature: "Nature",
  perception: "Perception",
  performance: "Représentation",
  persuasion: "Persuasion",
  religion: "Religion",
  sleightOfHand: "Escamotage",
  stealth: "Discrétion",
  survival: "Survie",
};

export const skillAbilities: Record<string, string> = {
  acrobatics: "dexterity",
  animalHandling: "wisdom",
  arcana: "intelligence",
  athletics: "strength",
  deception: "charisma",
  history: "intelligence",
  insight: "wisdom",
  intimidation: "charisma",
  investigation: "intelligence",
  medicine: "wisdom",
  nature: "intelligence",
  perception: "wisdom",
  performance: "charisma",
  persuasion: "charisma",
  religion: "intelligence",
  sleightOfHand: "dexterity",
  stealth: "dexterity",
  survival: "wisdom",
};

export const classLabels: Record<string, string> = {
  barbarian: "Barbare",
  bard: "Barde",
  cleric: "Clerc",
  druid: "Druide",
  fighter: "Guerrier",
  monk: "Moine",
  paladin: "Paladin",
  ranger: "Rôdeur",
  rogue: "Roublard",
  sorcerer: "Ensorceleur",
  warlock: "Occultiste",
  wizard: "Magicien",
};

export const subclassLabels: Record<string, string> = {
  hexblade: "Lame Maudite",
  evocation: "Évocation",
  war: "Guerre",
};

export const backgroundLabels: Record<string, string> = {
  acolyte: "Acolyte",
  charlatan: "Charlatan",
  criminal: "Criminel",
  entertainer: "Artiste",
  folkHero: "Héros du peuple",
  guildArtisan: "Artisan de guilde",
  hermit: "Ermite",
  noble: "Noble",
  outlander: "Étranger",
  sage: "Sage",
  sailor: "Marin",
  soldier: "Soldat",
  urchin: "Vaurien",
};

export const spellSchoolLabels: Record<string, string> = {
  abjuration: "Abjuration",
  conjuration: "Invocation",
  divination: "Divination",
  enchantment: "Enchantement",
  evocation: "Évocation",
  illusion: "Illusion",
  necromancy: "Nécromancie",
  transmutation: "Transmutation",
};

export function getSpellLevelLabel(level: number): string {
  if (level === 0) return "Tour de magie";
  return `Niveau ${level}`;
}
