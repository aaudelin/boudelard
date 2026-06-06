import { Enemy } from "@/types/enemy";

export const enemies: Enemy[] = [
  {
    id: "drone-surveillance",
    name: "Drone de surveillance",
    hp: 15,
    ac: 14,
    powerLevel: "1/3",
    speed: "Vol 12m",
    attacks: [
      {
        name: "Rayon",
        bonus: 5,
        damage: "2d6",
        damageType: "foudre",
        range: "18m",
      },
    ],
    abilities: [
      {
        name: "Alerte",
        description:
          "Si pas détruit en 2 rounds, 1d4 Homoncules arrivent en renfort",
      },
    ],
  },
  {
    id: "homoncule-ameliore",
    name: "Homoncule amélioré",
    hp: 12,
    ac: 14,
    powerLevel: "1/4",
    attacks: [
      {
        name: "Attaque",
        bonus: 5,
        damage: "1d6+2",
        damageType: "perforant",
      },
    ],
    abilities: [
      {
        name: "Explosion",
        description:
          "Explose en mourant : 2d4 dégâts feu, zone 1,5m, JS Dex DD 12 pour moitié",
      },
    ],
  },
  {
    id: "gardien-porte",
    name: "Gardien de porte",
    hp: 25,
    ac: 15,
    powerLevel: "1/2",
    attacks: [
      {
        name: "Coup",
        bonus: 6,
        damage: "1d10+3",
        damageType: "contondant",
      },
    ],
    abilities: [
      {
        name: "Alerte",
        description: "Peut appeler des renforts en 1 action",
      },
    ],
  },
  {
    id: "drone-araignee",
    name: "Drone-araignée",
    hp: 8,
    ac: 13,
    powerLevel: "1/4",
    attacks: [
      {
        name: "Morsure",
        bonus: 4,
        damage: "1d4 + 1d6 poison",
        damageType: "perforant",
        range: "1,5m",
      },
    ],
    abilities: [
      {
        name: "Poison",
        description: "JS Con DD 12 ou 1d6 dégâts poison supplémentaires",
      },
      {
        name: "Pattes adhésives",
        description: "Peut marcher sur les murs et plafonds",
      },
    ],
  },
  {
    id: "avatar-axe-musk",
    name: "Avatar d'Axe Musk",
    hp: 55,
    ac: 15,
    powerLevel: "2",
    speed: "Vol 9m (stationnaire)",
    attacks: [
      {
        name: "Rayon laser",
        bonus: 6,
        damage: "3d8",
        damageType: "force",
        range: "18m",
      },
      {
        name: "Bras robotique",
        bonus: 6,
        damage: "2d8+4",
        damageType: "contondant",
        range: "1,5m",
      },
    ],
    abilities: [
      {
        name: "Drone de soutien (Recharge 5-6)",
        description: "Invoque 2 Homoncules",
      },
      {
        name: "Scan (Action bonus)",
        description:
          "Cible un joueur. Avantage contre cette cible jusqu'au prochain tour.",
      },
      {
        name: "Bouclier de données (Réaction)",
        description: "+3 CA contre une attaque, OU annule un sort de niveau 1",
      },
    ],
    immunities: ["Poison", "Psychique", "Froid"],
    resistances: ["Force"],
  },
  {
    id: "serveur-central",
    name: "Serveur Central",
    hp: 35,
    ac: 10,
    powerLevel: "1",
    speed: "Immobile",
    attacks: [
      {
        name: "Décharge d'urgence",
        bonus: 0,
        damage: "3d6",
        damageType: "foudre",
        range: "6m (zone)",
      },
    ],
    abilities: [
      {
        name: "Décharge d'urgence",
        description:
          "Tous les ennemis à 6m, JS Dextérité DD 14, 3d6 foudre ou moitié",
      },
      {
        name: "Renforts",
        description: "Chaque round, 1d4+1 Homoncules entrent",
      },
      {
        name: "Vulnérabilité temporaire",
        description:
          "Après une Décharge d'urgence, vulnérable à TOUT pendant 1 round",
      },
    ],
    vulnerabilities: ["Foudre", "Eau"],
    resistances: ["Tout le reste"],
  },
];

export function getEnemyById(id: string): Enemy | undefined {
  return enemies.find((e) => e.id === id);
}
