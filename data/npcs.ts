import { Npc } from "@/types/npc";

export const npcs: Npc[] = [
  {
    id: "belle",
    name: "Belle",
    race: "Goth",
    class: "Guerrière",
    level: 4,
    hp: 30,
    ac: 15,
    powerLevel: "1/2",
    speed: "9m",
    initiativeBonus: 2,
    // Guerrière meneuse façon Vétéran SRD : FOR 16 (Lame de récup +5),
    // sauvegardes FOR/CON de guerrier, CHA correcte pour son aura
    abilityScores: { str: 16, dex: 14, con: 14, int: 10, wis: 11, cha: 14 },
    savingThrows: { str: 5, con: 4 },
    skills: [
      { name: "Athlétisme", bonus: 5 },
      { name: "Intimidation", bonus: 4 },
    ],
    attacks: [
      {
        name: "Lame de récup",
        bonus: 5,
        damage: "1d8+3",
        damageType: "tranchant",
      },
      {
        name: "Pistolet à impulsion",
        bonus: 5,
        damage: "1d8+2",
        damageType: "foudre",
        range: "18m",
      },
    ],
    abilities: [
      {
        name: "Meneuse",
        description:
          "Les alliés à 9m gagnent +1 aux jets d'attaque tant que Belle est consciente",
      },
    ],
  },
  {
    id: "formeus",
    name: "Formeus le sage",
    race: "Goth",
    class: "Mage",
    level: 3,
    hp: 18,
    ac: 12,
    // Ses soins illimités (1d8+3/tour) annulent les dégâts d'un seul aventurier
    powerLevel: "1/2",
    speed: "6m",
    initiativeBonus: 0,
    // Cf. Mage SRD : INT 16 (Éclair de données +5), sauvegardes INT/SAG
    abilityScores: { str: 8, dex: 12, con: 12, int: 16, wis: 15, cha: 10 },
    savingThrows: { int: 5, wis: 4 },
    skills: [
      { name: "Arcanes", bonus: 5 },
      { name: "Histoire", bonus: 5 },
      { name: "Médecine", bonus: 4 },
    ],
    attacks: [
      {
        name: "Bâton",
        bonus: 3,
        damage: "1d6+1",
        damageType: "contondant",
      },
    ],
    abilities: [
      {
        name: "Sagesse ancienne",
        description: "Connaît l'histoire des Goths et les secrets de la Matrice",
      },
    ],
    spells: [
      {
        name: "Soin des circuits",
        description: "Rend 1d8+3 PV à une créature au toucher",
      },
      {
        name: "Techno-mancie de Mécania",
        description:
          "Forge et greffe une prothèse à partir de métal d'Axe Musk et d'un cristal de la Matrice. Demande 1 nuit de travail et trois composants (cf. scénario)",
      },
      {
        name: "Éclair de données",
        description: "+5 au toucher, 2d8 dégâts de foudre, portée 18m",
      },
      {
        name: "Voile de la Matrice",
        description:
          "Une créature à 9m gagne +2 CA jusqu'au début de son prochain tour",
      },
    ],
  },
  {
    id: "goth-rebelle",
    name: "Goth rebelle",
    race: "Goth",
    class: "Combattant",
    level: 1,
    hp: 15,
    ac: 13,
    powerLevel: "1/3",
    initiativeBonus: 1,
    // Combattant de rue façon Malfrat SRD : FOR 14 (Tuyau métallique +4)
    abilityScores: { str: 14, dex: 13, con: 12, int: 10, wis: 10, cha: 12 },
    skills: [
      { name: "Investigation", bonus: 2 },
      { name: "Discrétion", bonus: 3 },
    ],
    attacks: [
      {
        name: "Tuyau métallique",
        bonus: 4,
        damage: "1d6+2",
        damageType: "contondant",
      },
      {
        name: "Fronde",
        bonus: 4,
        damage: "1d4+2",
        damageType: "contondant",
        range: "9m",
      },
    ],
    abilities: [
      {
        name: "Sabotage",
        description: "Avantage sur les jets pour désactiver des machines",
      },
    ],
  },
  // --- Scénario 2, partie 2 : Le Masque de Henry Le Pottier ---
  {
    id: "mysteria",
    name: "Mysteria",
    race: "Goth",
    class: "Éclaireuse",
    level: 3,
    hp: 24,
    ac: 14,
    powerLevel: "1/3",
    speed: "9m",
    initiativeBonus: 3,
    // Éclaireuse façon Espion SRD : DEX 16 (arbalète +5) et attaque
    // sournoise, pas de quoi tenir en mêlée
    abilityScores: { str: 10, dex: 16, con: 12, int: 13, wis: 14, cha: 12 },
    savingThrows: { dex: 5, wis: 4 },
    skills: [
      { name: "Discrétion", bonus: 5 },
      { name: "Perception", bonus: 4 },
      { name: "Survie", bonus: 4 },
    ],
    attacks: [
      {
        name: "Arbalète de poing",
        bonus: 5,
        damage: "1d6+3",
        damageType: "perforant",
        range: "9m",
      },
      {
        name: "Couteau de récup",
        bonus: 5,
        damage: "1d4+3",
        damageType: "perforant",
      },
    ],
    abilities: [
      {
        name: "Attaque sournoise (1×/tour)",
        description:
          "+2d6 dégâts si elle a l'avantage ou si un allié est au contact de la cible",
      },
      {
        name: "Elle voit les coutures",
        description:
          "Depuis la mort d'Axe Musk, Mysteria perçoit les anomalies du monde : avantage à l'Investigation pour repérer un glitch",
      },
    ],
  },
  {
    id: "dobbix",
    name: "Dobbix, processus orphelin",
    race: "Processus",
    class: "PNJ supprimé",
    level: 1,
    hp: 10,
    ac: 12,
    powerLevel: "1/4",
    speed: "9m",
    initiativeBonus: 2,
    // Petite créature de service effacée du monde mais jamais nettoyée :
    // inoffensive au combat, précieuse hors combat (INT 15 → +4)
    abilityScores: { str: 8, dex: 14, con: 10, int: 15, wis: 12, cha: 8 },
    skills: [
      { name: "Arcanes", bonus: 4 },
      { name: "Discrétion", bonus: 4 },
      { name: "Investigation", bonus: 4 },
    ],
    attacks: [
      {
        name: "Coup de registre",
        bonus: 4,
        damage: "1d4+2",
        damageType: "contondant",
      },
    ],
    abilities: [
      {
        name: "Parle en messages d'erreur",
        description:
          "« Dobbix est désolé. Dobbix n'existe plus depuis 47 ans. Erreur 404 : Dobbix non trouvé. » Il dit la vérité, mais il faut la traduire",
      },
      {
        name: "Les portes de service",
        description:
          "1×/heure, ouvre un passage entre deux zones non rendues qu'il connaît. Il connaît toutes les coulisses du monde",
      },
      {
        name: "Non rendu",
        description:
          "Les PNJ de la simulation ne le voient pas et ne peuvent pas le cibler. Les Effaceurs, si",
      },
    ],
    spells: [
      {
        name: "Journal système",
        description:
          "Récite ce qui s'est passé dans un rayon de 30m au cours des 10 dernières minutes",
      },
      {
        name: "Restauration de sauvegarde (1×/jour)",
        description:
          "Remet un objet brisé dans l'état où il était il y a 1 minute",
      },
    ],
  },
  {
    id: "belle-liberee",
    name: "Belle (libérée)",
    race: "Goth",
    class: "Guerrière",
    level: 4,
    hp: 18,
    ac: 14,
    // Vidée par 47 jours de possession : elle tient debout, c'est tout
    powerLevel: "1/3",
    speed: "6m",
    initiativeBonus: 1,
    // Les stats de Belle amputées de l'épuisement : FOR 14 au lieu de 16,
    // plus de pistolet (Henry le lui a pris)
    abilityScores: { str: 14, dex: 12, con: 12, int: 10, wis: 11, cha: 14 },
    savingThrows: { str: 4, con: 3 },
    skills: [
      { name: "Intimidation", bonus: 4 },
      { name: "Perspicacité", bonus: 2 },
    ],
    attacks: [
      {
        name: "Lame de récup",
        bonus: 4,
        damage: "1d8+2",
        damageType: "tranchant",
      },
    ],
    abilities: [
      {
        name: "Épuisée",
        description:
          "Désavantage aux tests de Force et de Dextérité tant qu'elle n'a pas fait un repos long",
      },
      {
        name: "Ce que Belle a vu",
        description:
          "Elle est restée consciente tout du long, prisonnière de son propre corps. Elle a tout entendu : c'est la meilleure source d'informations sur Henry",
      },
    ],
  },
];

export function getNpcById(id: string): Npc | undefined {
  return npcs.find((n) => n.id === id);
}
