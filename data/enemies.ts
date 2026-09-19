import { Enemy } from "@/types/enemy";

export const enemies: Enemy[] = [
  {
    id: "drone-surveillance",
    name: "Drone de surveillance",
    hp: 15,
    ac: 14,
    // Seul, on ne le détruit pas en 2 rounds : l'Alerte déclenche les renforts
    powerLevel: "1/2",
    speed: "Vol 12m",
    initiativeBonus: 2,
    // Cf. Homoncule SRD : engin volant fragile, tir précis (DEX),
    // Perception « programmée » élevée malgré une INT basse
    abilityScores: { str: 6, dex: 16, con: 10, int: 8, wis: 16, cha: 4 },
    skills: [{ name: "Perception", bonus: 5 }],
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
    initiativeBonus: 1,
    // Homoncule SRD avec bras mécanique renforcé (FOR 16 → attaque +5)
    abilityScores: { str: 16, dex: 12, con: 12, int: 10, wis: 10, cha: 6 },
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
    initiativeBonus: 0,
    // Cf. Armure animée SRD : construction lourde, sauvegarde CON maîtrisée
    abilityScores: { str: 18, dex: 10, con: 14, int: 3, wis: 10, cha: 3 },
    savingThrows: { con: 4 },
    skills: [{ name: "Perception", bonus: 2 }],
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
    initiativeBonus: 3,
    // Cf. Araignée-loup géante SRD : agile et discrète, très fragile
    abilityScores: { str: 6, dex: 15, con: 8, int: 4, wis: 10, cha: 3 },
    skills: [{ name: "Discrétion", bonus: 4 }],
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
    initiativeBonus: 2,
    // Boss : physique d'Ogre SRD (2d8+4 exact) + IA supérieure (INT 19
    // → rayon laser +6), deux sauvegardes maîtrisées
    abilityScores: { str: 19, dex: 14, con: 18, int: 19, wis: 14, cha: 16 },
    savingThrows: { con: 6, cha: 5 },
    skills: [
      { name: "Intimidation", bonus: 5 },
      { name: "Perception", bonus: 4 },
      { name: "Investigation", bonus: 6 },
    ],
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
    initiativeBonus: -2,
    // Machine immobile : INT 18 justifie le DD 14 de la Décharge
    // d'urgence (8 + maîtrise 2 + mod 4)
    abilityScores: { str: 1, dex: 7, con: 16, int: 18, wis: 8, cha: 1 },
    savingThrows: { con: 5, int: 6 },
    skills: [{ name: "Investigation", bonus: 6 }],
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
  // --- Scénario 2, partie 2 : Le Masque de Henry Le Pottier ---
  {
    id: "figurant",
    name: "Figurant de Mécania",
    hp: 9,
    ac: 12,
    powerLevel: "1/4",
    speed: "9m",
    initiativeBonus: 0,
    // PNJ de décor de la simulation : un villageois vidé de sa substance.
    // Cf. Zombi SRD sans la résistance : lent, insensible, remplaçable
    abilityScores: { str: 12, dex: 10, con: 10, int: 3, wis: 6, cha: 1 },
    attacks: [
      {
        name: "Étreinte polie",
        bonus: 3,
        damage: "1d6+1",
        damageType: "contondant",
      },
    ],
    abilities: [
      {
        name: "Copier-coller",
        description:
          "Quand un Figurant tombe à 0 PV, lancez 1d6 : sur 5-6, un autre Figurant entre en scène au bord de la carte au début du round suivant",
      },
      {
        name: "Sourire figé",
        description:
          "Aucun test de Charisme ne fonctionne sur lui : il répond toujours la même phrase, avec le même sourire",
      },
      {
        name: "Désencodage",
        description:
          "À 0 PV, il ne saigne pas : il se pixellise et disparaît. Aucun cadavre, aucun butin",
      },
    ],
    immunities: ["Charme", "Peur", "Poison"],
  },
  {
    id: "effaceur",
    name: "Effaceur",
    hp: 22,
    ac: 15,
    // Agent de purge : dangereux en duo, gérable seul
    powerLevel: "1/2",
    speed: "9m",
    initiativeBonus: 3,
    // Silhouette grise sans visage : agile et précise (DEX 16 → +5),
    // mais c'est un processus, pas une chair : le psychique le corrompt
    abilityScores: { str: 10, dex: 16, con: 12, int: 14, wis: 12, cha: 6 },
    savingThrows: { dex: 5, int: 4 },
    skills: [{ name: "Discrétion", bonus: 5 }],
    attacks: [
      {
        name: "Lame d'effacement",
        bonus: 5,
        damage: "2d6+3",
        damageType: "force",
        range: "1,5m",
      },
    ],
    abilities: [
      {
        name: "Effacement",
        description:
          "Sur un coup au but, la cible fait un JS Intelligence DD 13 : en cas d'échec, elle ne peut ni lancer de sort ni utiliser de capacité de classe jusqu'à la fin de son prochain tour (attaques d'arme toujours possibles)",
      },
      {
        name: "Glisse dans le vide (Action bonus)",
        description:
          "Se téléporte de 9m vers un espace inoccupé qu'il peut voir. Uniquement dans les Terres Non Rendues",
      },
    ],
    resistances: ["Perforant", "Tranchant"],
    vulnerabilities: ["Psychique"],
  },
  {
    id: "desencodeur",
    name: "Désencodeur",
    hp: 26,
    ac: 13,
    powerLevel: "1/2",
    speed: "Vol 9m (vol stationnaire)",
    initiativeBonus: 2,
    // Mange les souvenirs au lieu de la joie. SAG 14 pour un DD 13
    // (8 + maîtrise 2 + mod 2) sur son aura et sa faiblesse
    abilityScores: { str: 8, dex: 14, con: 14, int: 6, wis: 14, cha: 12 },
    savingThrows: { wis: 4, cha: 3 },
    skills: [{ name: "Perception", bonus: 4 }],
    attacks: [
      {
        name: "Aspiration de mémoire",
        bonus: 4,
        damage: "2d8",
        damageType: "psychique",
        range: "1,5m",
      },
    ],
    abilities: [
      {
        name: "Aura d'oubli",
        description:
          "Une créature qui commence son tour à 3m ou moins fait un JS Sagesse DD 13 : en cas d'échec, elle oublie pourquoi elle est là (désavantage aux tests d'INT et de SAG jusqu'à la fin de son tour)",
      },
      {
        name: "Souviens-toi (faiblesse)",
        description:
          "Si un aventurier raconte à voix haute un vrai souvenir de sa vie d'avant Mécania, le Désencodeur fait un JS Sagesse DD 13 : en cas d'échec, il fuit à pleine vitesse pendant 1 round. Un même souvenir ne marche qu'une fois",
      },
    ],
    immunities: ["Froid", "Poison", "Charme", "Peur"],
    vulnerabilities: ["Radiant"],
  },
  {
    id: "molosse-pare-feu",
    name: "Molosse du Pare-Feu (Touffu 2.0)",
    hp: 45,
    ac: 15,
    // Gros sac à PV, mais la berceuse permet de l'éviter entièrement
    powerLevel: "1",
    speed: "12m",
    initiativeBonus: 1,
    // Cf. Ours-hibou SRD pour le gabarit (FOR 18 → +6), trois têtes qui
    // montent chacune la garde sur un « port » différent
    abilityScores: { str: 18, dex: 13, con: 16, int: 3, wis: 12, cha: 6 },
    savingThrows: { con: 5 },
    skills: [{ name: "Perception", bonus: 3 }],
    attacks: [
      {
        name: "Morsure — tête rouge",
        bonus: 6,
        damage: "1d8+3",
        damageType: "feu",
        range: "1,5m",
      },
      {
        name: "Morsure — tête bleue",
        bonus: 6,
        damage: "1d8+3",
        damageType: "foudre",
        range: "1,5m",
      },
      {
        name: "Morsure — tête blanche",
        bonus: 6,
        damage: "1d8+3",
        damageType: "force",
        range: "1,5m",
      },
    ],
    abilities: [
      {
        name: "Attaque multiple",
        description:
          "Deux morsures par tour, de deux têtes différentes et éveillées. Pour un combat brutal, le MJ peut passer à trois morsures",
      },
      {
        name: "Vigilance à trois têtes",
        description:
          "Avantage aux tests de Perception, ne peut pas être surpris et voit les créatures invisibles",
      },
      {
        name: "Berceuse (faiblesse)",
        description:
          "De la musique l'endort. Un test de Représentation DD 15 endort une tête pour 1 minute ; une tête endormie n'attaque plus. Trois réussites et le molosse s'effondre : on passe sans combattre",
      },
    ],
    resistances: ["Contondant, perforant et tranchant non magiques"],
  },
  {
    id: "auror-reecrit",
    name: "Auror Réécrit",
    hp: 36,
    ac: 16,
    powerLevel: "1",
    speed: "9m",
    initiativeBonus: 2,
    // Ancien gardien de Boudelard recompilé par l'Administrateur :
    // baguette réglementaire (INT 16 → +5), discipline sans faille
    abilityScores: { str: 12, dex: 15, con: 14, int: 16, wis: 13, cha: 12 },
    savingThrows: { int: 5, wis: 3 },
    skills: [
      { name: "Investigation", bonus: 5 },
      { name: "Perception", bonus: 3 },
    ],
    attacks: [
      {
        name: "Matraque-baguette",
        bonus: 5,
        damage: "1d8+2",
        damageType: "contondant",
        range: "1,5m",
      },
      {
        name: "Sortilège de contrainte",
        bonus: 5,
        damage: "2d8",
        damageType: "force",
        range: "18m",
      },
    ],
    abilities: [
      {
        name: "Contrainte",
        description:
          "Sur un coup du Sortilège de contrainte, JS Force DD 13 ou la cible est entravée jusqu'à la fin de son prochain tour",
      },
      {
        name: "Réécriture (Recharge 5-6)",
        description:
          "Échange sa place avec un autre Auror Réécrit à 18m ; les deux récupèrent 5 PV",
      },
      {
        name: "Ordre de l'Administrateur",
        description:
          "Sous son masque, un visage d'aventurier d'il y a 47 ans. Il ne parle pas, il récite : « ACCÈS REFUSÉ »",
      },
    ],
    immunities: ["Charme", "Peur"],
  },
  {
    id: "belle-avatar",
    name: "Belle — Avatar de l'Administrateur",
    hp: 45,
    ac: 16,
    // Phase 1 du boss : dure, mais le masque se fend à mi-vie
    powerLevel: "1",
    speed: "9m",
    initiativeBonus: 3,
    // Les stats de Belle, montées d'un cran : ce n'est plus elle qui
    // les pilote. CHA 18 (+4, maîtrise 3 → Tromperie +7) tient le masque
    abilityScores: { str: 16, dex: 16, con: 14, int: 14, wis: 12, cha: 18 },
    savingThrows: { str: 6, con: 5, cha: 7 },
    skills: [
      { name: "Athlétisme", bonus: 6 },
      { name: "Intimidation", bonus: 7 },
      { name: "Tromperie", bonus: 7 },
    ],
    attacks: [
      {
        name: "Lame de récup",
        bonus: 6,
        damage: "1d8+3",
        damageType: "tranchant",
      },
      {
        name: "Pistolet à impulsion",
        bonus: 6,
        damage: "2d6+3",
        damageType: "foudre",
        range: "18m",
      },
    ],
    abilities: [
      {
        name: "Attaque multiple",
        description: "Deux attaques par tour",
      },
      {
        name: "Visage volé",
        description:
          "La première fois qu'elle tombe sous 22 PV, le masque se fend : déclenchez la révélation et remplacez-la par Henry Le Pottier (PV neufs)",
      },
      {
        name: "Meneuse retournée",
        description:
          "Les alliés à 9m gagnent +1 aux jets d'attaque tant qu'elle est consciente",
      },
      {
        name: "Elle connaît vos coups (Réaction)",
        description:
          "Quand un aventurier la rate, elle se déplace de 3m sans provoquer d'attaque d'opportunité. Elle a combattu à leurs côtés : elle sait comment ils frappent",
      },
    ],
    immunities: ["Charme", "Peur"],
  },
  {
    id: "henry-le-pottier",
    name: "Henry Le Pottier, l'Administrateur",
    hp: 55,
    ac: 17,
    powerLevel: "2",
    speed: "9m (Transplanage 12m)",
    initiativeBonus: 4,
    // Boss de fin de session. INT 20 (+5, maîtrise 3 → +8 et DD 15)
    // pour un duelliste qui écrit la réalité au lieu de la frapper
    abilityScores: { str: 10, dex: 18, con: 16, int: 20, wis: 16, cha: 18 },
    savingThrows: { int: 8, wis: 6, cha: 7 },
    skills: [
      { name: "Arcanes", bonus: 8 },
      { name: "Histoire", bonus: 8 },
      { name: "Perspicacité", bonus: 6 },
      { name: "Tromperie", bonus: 7 },
    ],
    attacks: [
      {
        name: "Baguette-Racine",
        bonus: 8,
        damage: "3d8",
        damageType: "force",
        range: "24m",
      },
      {
        name: "Sortilège d'Écriture",
        bonus: 8,
        damage: "3d6",
        damageType: "psychique",
        range: "18m",
      },
    ],
    abilities: [
      {
        name: "Les Trois Sceaux",
        description:
          "Henry ne peut pas mourir ici. À 0 PV, il brise un Sceau : il remonte à 20 PV, les créatures à 3m subissent 2d8 force (JS Dex DD 15 pour moitié) et il lâche une vérité. Après le troisième Sceau, il ne se relève pas : il saigne pour de vrai",
      },
      {
        name: "Sortilège d'Écriture",
        description:
          "Sur un coup au but, JS Sagesse DD 15 ou la cible utilise sa réaction pour attaquer l'allié le plus proche",
      },
      {
        name: "Réécriture du décor (1×/combat)",
        description:
          "Le Noyau Souverain redessine la salle : toutes les créatures font un JS Dextérité DD 15 ou subissent 2d6 contondant et tombent à terre. Le MJ change la carte",
      },
      {
        name: "Transplanage (Action bonus)",
        description: "Se téléporte de 12m vers un endroit qu'il peut voir",
      },
      {
        name: "Le garçon qui a survécu (Réaction, 3×/combat)",
        description: "Réduit de 10 les dégâts d'une attaque qui le touche",
      },
      {
        name: "Faille : son nom",
        description:
          "Une fois la révélation faite, un aventurier peut prononcer « Henry Le Pottier » à voix haute (action bonus) : Henry perd sa réaction jusqu'à la fin de son prochain tour",
      },
    ],
    immunities: ["Charme", "Peur"],
    resistances: [
      "Psychique",
      "Contondant, perforant et tranchant non magiques",
    ],
  },
  {
    id: "rature",
    name: "La Rature",
    hp: 26,
    ac: 13,
    // Calibrée pour UN magicien de niveau 4 tout seul : elle doit faire peur
    // sans pouvoir le tuer avant 4 rounds
    powerLevel: "1/2",
    speed: "9m",
    initiativeBonus: 2,
    // Une silhouette faite de mots barrés. Petite cousine de l'Effaceur :
    // c'est exprès, elle annonce l'Acte 3
    abilityScores: { str: 12, dex: 14, con: 12, int: 10, wis: 12, cha: 8 },
    skills: [{ name: "Discrétion", bonus: 4 }],
    attacks: [
      {
        name: "Griffe d'encre",
        bonus: 4,
        damage: "1d8+2",
        damageType: "psychique",
        range: "1,5m",
      },
    ],
    abilities: [
      {
        name: "Elle efface les mots",
        description:
          "Sur un coup au but, la cible ne peut pas relancer le même sort à son prochain tour",
      },
      {
        name: "Elle grossit du silence",
        description:
          "À la fin de chaque round où la cible n'a pas accepté l'aide de son passager, la Rature gagne 5 PV temporaires et +1 à ses jets d'attaque (cumulatif)",
      },
      {
        name: "Faite de silence",
        description:
          "47 ans sans que personne écoute, ça finit par prendre une forme. Elle ne parle pas, elle rature",
      },
      {
        name: "Ce n'est qu'un rêve",
        description:
          "Si la cible tombe à 0 PV, elle ne meurt pas : elle se réveille en sursaut et l'épreuve est ratée (cf. scénario, Acte 1 Fil C)",
      },
    ],
    immunities: ["Charme", "Peur", "Psychique"],
    resistances: ["Contondant, perforant et tranchant non magiques"],
  },
];

export function getEnemyById(id: string): Enemy | undefined {
  return enemies.find((e) => e.id === id);
}
