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
];

export function getNpcById(id: string): Npc | undefined {
  return npcs.find((n) => n.id === id);
}
