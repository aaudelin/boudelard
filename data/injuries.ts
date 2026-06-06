import { Injury } from "@/types/injury";

// Matrice de blessures sur un jet de d100.
// Plus le résultat est élevé (proche de 100), plus la blessure est grave.
// À utiliser typiquement sur un coup critique ou quand un personnage tombe à 0 PV.
export const injuries: Injury[] = [
  {
    id: "egratignure",
    min: 1,
    max: 10,
    severity: "légère",
    name: "Égratignure",
    effect: "Blessure superficielle, aucun effet mécanique.",
  },
  {
    id: "ecchymose",
    min: 11,
    max: 20,
    severity: "légère",
    name: "Ecchymose",
    effect: "Désavantage à la prochaine attaque (le coup sonne).",
  },
  {
    id: "coupure",
    min: 21,
    max: 30,
    severity: "légère",
    name: "Coupure",
    effect: "Saignement : 1 dégât au début de chacun de vos tours pendant 1d4 rounds.",
  },
  {
    id: "entorse",
    min: 31,
    max: 40,
    severity: "modérée",
    name: "Entorse",
    effect: "Vitesse réduite de moitié pendant 1d4 rounds.",
  },
  {
    id: "cote-felee",
    min: 41,
    max: 50,
    severity: "modérée",
    name: "Côte fêlée",
    effect:
      "Désavantage aux tests de Force et de Constitution jusqu'à un repos court.",
  },
  {
    id: "foulure-profonde",
    min: 51,
    max: 58,
    severity: "modérée",
    name: "Foulure profonde",
    effect: "Désavantage aux attaques de mêlée pendant 1 minute.",
  },
  {
    id: "membre-demis",
    min: 59,
    max: 66,
    severity: "grave",
    name: "Membre démis",
    effect:
      "Un bras ou une jambe (au choix du MJ) est inutilisable. JS Constitution DD 13 à la fin de chaque tour pour le remettre.",
  },
  {
    id: "fracture-ouverte",
    min: 67,
    max: 73,
    severity: "grave",
    name: "Fracture ouverte",
    effect:
      "Désavantage à toutes les attaques et aux JS Dextérité. Soins magiques ou repos long requis pour guérir.",
  },
  {
    id: "hemorragie",
    min: 74,
    max: 80,
    severity: "grave",
    name: "Hémorragie",
    effect:
      "1d6 dégâts au début de chaque tour. Un allié peut stopper le saignement avec un test de Médecine DD 13 (action).",
  },
  {
    id: "organe-perfore",
    min: 81,
    max: 86,
    severity: "critique",
    name: "Organe perforé",
    effect:
      "1 niveau d'épuisement et maximum de PV réduit de moitié jusqu'à un repos long.",
  },
  {
    id: "sens-touche",
    min: 87,
    max: 91,
    severity: "critique",
    name: "Œil ou oreille touché",
    effect:
      "Désavantage aux tests de Perception et aux attaques à distance jusqu'à guérison magique.",
  },
  {
    id: "commotion",
    min: 92,
    max: 95,
    severity: "critique",
    name: "Commotion cérébrale",
    effect:
      "Étourdi pendant 1 round, puis désavantage aux JS Intelligence et Sagesse pendant 1 minute.",
  },
  {
    id: "blessure-mortelle",
    min: 96,
    max: 98,
    severity: "fatale",
    name: "Blessure mortelle",
    effect:
      "Tombez immédiatement à 0 PV et commencez à agoniser. Désavantage aux jets de sauvegarde contre la mort.",
  },
  {
    id: "trauma-majeur",
    min: 99,
    max: 99,
    severity: "fatale",
    name: "Trauma majeur",
    effect: "Tombez à 0 PV avec un échec automatique au JS contre la mort.",
  },
  {
    id: "coup-fatal",
    min: 100,
    max: 100,
    severity: "fatale",
    name: "Coup fatal",
    effect:
      "Mort instantanée si la cible était déjà sous la moitié de ses PV max. Sinon, elle tombe à 0 PV avec 2 échecs automatiques au JS contre la mort.",
  },
];

/** Renvoie la blessure correspondant à un résultat de d100 (1 à 100). */
export function getInjuryByRoll(roll: number): Injury | undefined {
  return injuries.find((i) => roll >= i.min && roll <= i.max);
}

export function getInjuryById(id: string): Injury | undefined {
  return injuries.find((i) => i.id === id);
}
