import { Injury } from "@/types/injury";

// Matrice de 100 blessures sur un jet de d100 (1 à 100).
// Une entrée par résultat possible, de la plus banale (1) à la plus grave (100).
// Aucune blessure n'est mortelle.
export const injuries: Injury[] = [
  // --- Légères (1 à 30) ---
  {
    id: "egratignure",
    min: 1,
    max: 1,
    severity: "légère",
    name: "Égratignure",
    effect: "Blessure superficielle, aucun effet mécanique.",
  },
  {
    id: "ecchymose",
    min: 2,
    max: 2,
    severity: "légère",
    name: "Ecchymose",
    effect: "Un vilain bleu. Aucun effet mécanique.",
  },
  {
    id: "petite-coupure",
    min: 3,
    max: 3,
    severity: "légère",
    name: "Petite coupure",
    effect: "Saignement léger : 1 dégât au début de votre prochain tour.",
  },
  {
    id: "levre-fendue",
    min: 4,
    max: 4,
    severity: "légère",
    name: "Lèvre fendue",
    effect: "Cosmétique. Aucun effet mécanique.",
  },
  {
    id: "nez-en-sang",
    min: 5,
    max: 5,
    severity: "légère",
    name: "Nez en sang",
    effect:
      "Désavantage aux tests de Perception basés sur l'odorat pendant 1 minute.",
  },
  {
    id: "ecorchure-genou",
    min: 6,
    max: 6,
    severity: "légère",
    name: "Écorchure au genou",
    effect: "Cosmétique. Aucun effet mécanique.",
  },
  {
    id: "ongle-arrache",
    min: 7,
    max: 7,
    severity: "légère",
    name: "Ongle arraché",
    effect:
      "Douloureux : 1 dégât et désavantage au prochain test de Dextérité de cette main.",
  },
  {
    id: "doigt-coince",
    min: 8,
    max: 8,
    severity: "légère",
    name: "Doigt coincé",
    effect: "Désavantage à la prochaine attaque effectuée avec cette main.",
  },
  {
    id: "cheville-tordue",
    min: 9,
    max: 9,
    severity: "légère",
    name: "Cheville tordue",
    effect:
      "Vitesse réduite de 1,50 m jusqu'à la fin de votre prochain tour.",
  },
  {
    id: "poignet-foule",
    min: 10,
    max: 10,
    severity: "légère",
    name: "Poignet foulé",
    effect: "Désavantage à la prochaine attaque de mêlée.",
  },
  {
    id: "coude-cogne",
    min: 11,
    max: 11,
    severity: "légère",
    name: "Coude cogné",
    effect:
      "Bras engourdi : désavantage aux tests de Force de ce bras pendant 1 round.",
  },
  {
    id: "bosse-au-front",
    min: 12,
    max: 12,
    severity: "légère",
    name: "Bosse au front",
    effect: "Désavantage au prochain jet de sauvegarde de Sagesse.",
  },
  {
    id: "morsure-superficielle",
    min: 13,
    max: 13,
    severity: "légère",
    name: "Morsure superficielle",
    effect: "1 dégât. Aucun effet supplémentaire.",
  },
  {
    id: "brulure-legere",
    min: 14,
    max: 14,
    severity: "légère",
    name: "Brûlure légère",
    effect:
      "1 dégât de feu et désavantage pour saisir un objet de cette main pendant 1 round.",
  },
  {
    id: "echardes",
    min: 15,
    max: 15,
    severity: "légère",
    name: "Échardes dans la main",
    effect:
      "Désavantage aux tests de Dextérité de cette main pendant 1 minute.",
  },
  {
    id: "coup-au-tibia",
    min: 16,
    max: 16,
    severity: "légère",
    name: "Coup au tibia",
    effect:
      "Vitesse réduite de 1,50 m jusqu'à la fin de votre prochain tour.",
  },
  {
    id: "langue-mordue",
    min: 17,
    max: 17,
    severity: "légère",
    name: "Langue mordue",
    effect:
      "Lancer un sort à composante verbale nécessite un JS Constitution DD 8 pendant 1 minute.",
  },
  {
    id: "oeil-au-beurre-noir",
    min: 18,
    max: 18,
    severity: "légère",
    name: "Œil au beurre noir",
    effect:
      "Désavantage aux tests de Perception visuelle jusqu'à la fin de votre prochain tour.",
  },
  {
    id: "oreille-qui-siffle",
    min: 19,
    max: 19,
    severity: "légère",
    name: "Oreille qui siffle",
    effect: "Désavantage aux tests de Perception auditive pendant 1 minute.",
  },
  {
    id: "crampe-musculaire",
    min: 20,
    max: 20,
    severity: "légère",
    name: "Crampe musculaire",
    effect: "Vitesse réduite de moitié jusqu'à la fin de votre prochain tour.",
  },
  {
    id: "eraflure-joue",
    min: 21,
    max: 21,
    severity: "légère",
    name: "Éraflure à la joue",
    effect: "Cosmétique. Aucun effet mécanique.",
  },
  {
    id: "orteil-cogne",
    min: 22,
    max: 22,
    severity: "légère",
    name: "Orteil cogné",
    effect:
      "Vitesse réduite de 1,50 m jusqu'à la fin de votre prochain tour.",
  },
  {
    id: "souffle-coupe",
    min: 23,
    max: 23,
    severity: "légère",
    name: "Souffle coupé",
    effect: "Vous ne pouvez pas effectuer d'action bonus à votre prochain tour.",
  },
  {
    id: "griffure",
    min: 24,
    max: 24,
    severity: "légère",
    name: "Griffure",
    effect: "Saignement léger : 1 dégât au début de votre prochain tour.",
  },
  {
    id: "epaule-contusionnee",
    min: 25,
    max: 25,
    severity: "légère",
    name: "Épaule contusionnée",
    effect: "Désavantage à la prochaine attaque à distance.",
  },
  {
    id: "dent-ebrechee",
    min: 26,
    max: 26,
    severity: "légère",
    name: "Dent ébréchée",
    effect: "Cosmétique. Aucun effet mécanique.",
  },
  {
    id: "torticolis",
    min: 27,
    max: 27,
    severity: "légère",
    name: "Torticolis",
    effect:
      "Vous tournez mal la tête : désavantage aux tests de Perception pendant 1 minute.",
  },
  {
    id: "paume-ecorchee",
    min: 28,
    max: 28,
    severity: "légère",
    name: "Paume écorchée",
    effect: "Désavantage au prochain test de Force pour agripper.",
  },
  {
    id: "mollet-contracte",
    min: 29,
    max: 29,
    severity: "légère",
    name: "Mollet contracté",
    effect: "Vitesse réduite de 1,50 m pendant 1 minute.",
  },
  {
    id: "arcade-ouverte",
    min: 30,
    max: 30,
    severity: "légère",
    name: "Arcade sourcilière ouverte",
    effect: "Le sang gêne la vue : désavantage aux attaques pendant 1 round.",
  },

  // --- Modérées (31 à 60) ---
  {
    id: "entorse-cheville",
    min: 31,
    max: 31,
    severity: "modérée",
    name: "Entorse de la cheville",
    effect: "Vitesse réduite de moitié pendant 1d4 rounds.",
  },
  {
    id: "doigt-luxe",
    min: 32,
    max: 32,
    severity: "modérée",
    name: "Doigt luxé",
    effect:
      "Désavantage aux attaques avec cette main jusqu'à ce que le doigt soit remis (action).",
  },
  {
    id: "cote-felee",
    min: 33,
    max: 33,
    severity: "modérée",
    name: "Côte fêlée",
    effect:
      "Désavantage aux tests de Force et de Constitution jusqu'à un repos court.",
  },
  {
    id: "nez-casse",
    min: 34,
    max: 34,
    severity: "modérée",
    name: "Nez cassé",
    effect:
      "1d4 dégâts et désavantage aux tests de Perception (odorat) jusqu'à un repos long.",
  },
  {
    id: "coupure-profonde",
    min: 35,
    max: 35,
    severity: "modérée",
    name: "Coupure profonde",
    effect:
      "Saignement : 1d4 dégâts au début de chacun de vos tours pendant 1d4 rounds.",
  },
  {
    id: "brulure-deuxieme-degre",
    min: 36,
    max: 36,
    severity: "modérée",
    name: "Brûlure au deuxième degré",
    effect:
      "1d6 dégâts de feu et désavantage aux tests utilisant la zone brûlée pendant 1 heure.",
  },
  {
    id: "dent-cassee",
    min: 37,
    max: 37,
    severity: "modérée",
    name: "Dent cassée",
    effect:
      "1 dégât et désavantage aux tests de Charisme (sourire édenté) jusqu'à guérison.",
  },
  {
    id: "luxation-epaule",
    min: 38,
    max: 38,
    severity: "modérée",
    name: "Luxation de l'épaule",
    effect:
      "Le bras est inutilisable tant que l'épaule n'est pas remise (test de Médecine DD 12).",
  },
  {
    id: "entorse-poignet",
    min: 39,
    max: 39,
    severity: "modérée",
    name: "Entorse du poignet",
    effect: "Désavantage aux attaques et tests de cette main pendant 1 minute.",
  },
  {
    id: "dechirure-musculaire",
    min: 40,
    max: 40,
    severity: "modérée",
    name: "Déchirure musculaire",
    effect:
      "Vitesse réduite de moitié et désavantage aux tests de Force pendant 1 minute.",
  },
  {
    id: "plaie-cuir-chevelu",
    min: 41,
    max: 41,
    severity: "modérée",
    name: "Plaie au cuir chevelu",
    effect:
      "Saigne abondamment : 1d4 dégâts au début de votre prochain tour, désavantage à la Perception pendant 1 round.",
  },
  {
    id: "genou-tordu",
    min: 42,
    max: 42,
    severity: "modérée",
    name: "Genou tordu",
    effect: "Vitesse réduite de moitié jusqu'à un repos court.",
  },
  {
    id: "machoire-demboitee",
    min: 43,
    max: 43,
    severity: "modérée",
    name: "Mâchoire déboîtée",
    effect:
      "Impossible de parler clairement : sorts à composante verbale impossibles jusqu'à un repos court.",
  },
  {
    id: "coup-aux-cotes",
    min: 44,
    max: 44,
    severity: "modérée",
    name: "Coup aux côtes",
    effect: "Désavantage aux jets de sauvegarde de Constitution pendant 1 minute.",
  },
  {
    id: "entaille-avant-bras",
    min: 45,
    max: 45,
    severity: "modérée",
    name: "Entaille à l'avant-bras",
    effect: "1d4 dégâts et désavantage à la prochaine attaque de cette main.",
  },
  {
    id: "foulure-grave-cheville",
    min: 46,
    max: 46,
    severity: "modérée",
    name: "Foulure grave de la cheville",
    effect: "Vitesse réduite de moitié pendant 1 heure.",
  },
  {
    id: "doigt-fracture",
    min: 47,
    max: 47,
    severity: "modérée",
    name: "Doigt fracturé",
    effect:
      "Désavantage aux attaques et tests de Dextérité de cette main jusqu'à un repos long.",
  },
  {
    id: "orteil-casse",
    min: 48,
    max: 48,
    severity: "modérée",
    name: "Orteil cassé",
    effect: "Vitesse réduite de 3 m pendant 1 heure.",
  },
  {
    id: "brulure-main",
    min: 49,
    max: 49,
    severity: "modérée",
    name: "Brûlure à la main",
    effect:
      "1d6 dégâts de feu et désavantage pour manier une arme de cette main jusqu'à un repos court.",
  },
  {
    id: "balafre-visage",
    min: 50,
    max: 50,
    severity: "modérée",
    name: "Balafre au visage",
    effect: "1d4 dégâts. Cicatrice permanente, aucun autre effet mécanique.",
  },
  {
    id: "tympan-perce",
    min: 51,
    max: 51,
    severity: "modérée",
    name: "Tympan percé",
    effect:
      "Assourdi pendant 1 minute, puis désavantage à la Perception auditive jusqu'à guérison.",
  },
  {
    id: "cloison-deviee",
    min: 52,
    max: 52,
    severity: "modérée",
    name: "Cloison nasale déviée",
    effect: "Désavantage aux tests basés sur l'odorat jusqu'à des soins.",
  },
  {
    id: "claquage-cuisse",
    min: 53,
    max: 53,
    severity: "modérée",
    name: "Claquage à la cuisse",
    effect:
      "Vitesse réduite de moitié et désavantage aux tests d'Athlétisme pendant 1 heure.",
  },
  {
    id: "poignet-fracture",
    min: 54,
    max: 54,
    severity: "modérée",
    name: "Poignet fracturé",
    effect:
      "Cette main ne peut rien tenir tant que le poignet n'est pas soigné (repos long ou magie).",
  },
  {
    id: "cote-cassee",
    min: 55,
    max: 55,
    severity: "modérée",
    name: "Côte cassée",
    effect:
      "Désavantage aux tests de Force et de Constitution jusqu'à un repos long ; 1d4 dégâts si vous courez.",
  },
  {
    id: "entaille-cuisse",
    min: 56,
    max: 56,
    severity: "modérée",
    name: "Entaille profonde à la cuisse",
    effect:
      "Saignement : 1d4 dégâts au début de chacun de vos tours pendant 1d6 rounds.",
  },
  {
    id: "luxation-coude",
    min: 57,
    max: 57,
    severity: "modérée",
    name: "Luxation du coude",
    effect:
      "Le bras est inutilisable jusqu'à ce que le coude soit remis (test de Médecine DD 12).",
  },
  {
    id: "commotion-legere",
    min: 58,
    max: 58,
    severity: "modérée",
    name: "Légère commotion",
    effect:
      "Étourdi pendant 1 round, puis désavantage aux JS Intelligence et Sagesse pendant 1 minute.",
  },
  {
    id: "plaie-perforante-flanc",
    min: 59,
    max: 59,
    severity: "modérée",
    name: "Plaie perforante au flanc",
    effect: "1d6 dégâts et désavantage aux JS Constitution jusqu'à un repos court.",
  },
  {
    id: "tendon-etire",
    min: 60,
    max: 60,
    severity: "modérée",
    name: "Tendon étiré",
    effect: "Vitesse réduite de moitié pendant 1 heure ; sauter devient impossible.",
  },

  // --- Graves (61 à 85) ---
  {
    id: "fracture-avant-bras",
    min: 61,
    max: 61,
    severity: "grave",
    name: "Fracture de l'avant-bras",
    effect:
      "Le bras est hors d'usage jusqu'à une guérison magique ou un repos long ; désavantage aux attaques.",
  },
  {
    id: "fracture-jambe",
    min: 62,
    max: 62,
    severity: "grave",
    name: "Fracture de la jambe",
    effect:
      "Vous tombez à terre. Vitesse réduite à 0, puis 3 m une fois immobilisée, jusqu'à guérison.",
  },
  {
    id: "cote-perforante",
    min: 63,
    max: 63,
    severity: "grave",
    name: "Côte perforant un poumon",
    effect:
      "1 niveau d'épuisement et désavantage aux JS Constitution jusqu'à un repos long.",
  },
  {
    id: "hemorragie-externe",
    min: 64,
    max: 64,
    severity: "grave",
    name: "Hémorragie externe",
    effect:
      "1d6 dégâts au début de chaque tour. Un test de Médecine DD 13 (action) stoppe le saignement.",
  },
  {
    id: "tendon-achille-sectionne",
    min: 65,
    max: 65,
    severity: "grave",
    name: "Tendon d'Achille sectionné",
    effect:
      "Vitesse réduite de moitié et désavantage à la Dextérité jusqu'à une guérison magique.",
  },
  {
    id: "luxation-hanche",
    min: 66,
    max: 66,
    severity: "grave",
    name: "Luxation de la hanche",
    effect:
      "Vous tombez à terre ; vitesse réduite à 1,50 m jusqu'à ce que la hanche soit remise (DD 14).",
  },
  {
    id: "fractures-cotes-multiples",
    min: 67,
    max: 67,
    severity: "grave",
    name: "Fractures multiples des côtes",
    effect:
      "1 niveau d'épuisement et désavantage à toutes les attaques jusqu'à un repos long.",
  },
  {
    id: "plaie-abdomen",
    min: 68,
    max: 68,
    severity: "grave",
    name: "Plaie profonde à l'abdomen",
    effect:
      "Saignement : 1d6 dégâts par tour pendant 1d6 rounds, puis 1 niveau d'épuisement.",
  },
  {
    id: "fracture-machoire",
    min: 69,
    max: 69,
    severity: "grave",
    name: "Mâchoire fracturée",
    effect:
      "Impossible de parler ou de lancer des sorts à composante verbale jusqu'à guérison.",
  },
  {
    id: "genou-disloque",
    min: 70,
    max: 70,
    severity: "grave",
    name: "Genou disloqué",
    effect:
      "La jambe est inutilisable. Vitesse réduite à 0 jusqu'à immobilisation et repos long.",
  },
  {
    id: "fracture-cheville",
    min: 71,
    max: 71,
    severity: "grave",
    name: "Cheville fracturée",
    effect: "Vitesse réduite à 1,50 m jusqu'à une guérison magique ou un repos long.",
  },
  {
    id: "perte-phalange",
    min: 72,
    max: 72,
    severity: "grave",
    name: "Perte d'une phalange",
    effect:
      "Vous perdez le bout d'un doigt : désavantage aux tests de Dextérité fine de cette main jusqu'à régénération.",
  },
  {
    id: "brulure-troisieme-degre",
    min: 73,
    max: 73,
    severity: "grave",
    name: "Brûlure au troisième degré",
    effect:
      "2d6 dégâts de feu. Maximum de PV réduit jusqu'à un repos long. Cicatrices permanentes.",
  },
  {
    id: "clavicule-brisee",
    min: 74,
    max: 74,
    severity: "grave",
    name: "Clavicule brisée",
    effect:
      "Le bras concerné est inutilisable jusqu'à guérison ; désavantage aux attaques à deux mains.",
  },
  {
    id: "main-broyee",
    min: 75,
    max: 75,
    severity: "grave",
    name: "Main broyée",
    effect:
      "La main est inutilisable jusqu'à une guérison magique. Tout objet tenu tombe.",
  },
  {
    id: "fracture-ouverte-jambe",
    min: 76,
    max: 76,
    severity: "grave",
    name: "Fracture ouverte de la jambe",
    effect:
      "Vous tombez à terre. Saignement 1d6/tour pendant 1d4 rounds, vitesse 0 jusqu'à des soins.",
  },
  {
    id: "nerf-pince",
    min: 77,
    max: 77,
    severity: "grave",
    name: "Nerf pincé",
    effect:
      "Le bras est paralysé pendant 1d4 heures : aucun objet tenu, aucune attaque de ce bras.",
  },
  {
    id: "commotion-grave",
    min: 78,
    max: 78,
    severity: "grave",
    name: "Commotion cérébrale",
    effect:
      "Inconscient pendant 1 round, puis désavantage à toutes les actions pendant 1 minute.",
  },
  {
    id: "plaie-au-cou",
    min: 79,
    max: 79,
    severity: "grave",
    name: "Plaie au cou",
    effect:
      "Saignement abondant : 2d4 dégâts au début de chaque tour jusqu'à un test de Médecine DD 15.",
  },
  {
    id: "poumon-perfore",
    min: 80,
    max: 80,
    severity: "grave",
    name: "Poumon perforé",
    effect:
      "1 niveau d'épuisement et vitesse réduite de moitié. JS Constitution DD 13 par minute ou +1 épuisement, jusqu'à des soins.",
  },
  {
    id: "fracture-bassin",
    min: 81,
    max: 81,
    severity: "grave",
    name: "Fracture du bassin",
    effect:
      "Vous tombez à terre. Vitesse réduite à 0 (vous rampez à 1,50 m) jusqu'à une guérison magique.",
  },
  {
    id: "tendons-main-tranches",
    min: 82,
    max: 82,
    severity: "grave",
    name: "Tendons de la main tranchés",
    effect: "La main ne peut plus rien saisir jusqu'à une guérison magique.",
  },
  {
    id: "hemorragie-interne",
    min: 83,
    max: 83,
    severity: "grave",
    name: "Hémorragie interne",
    effect:
      "1 niveau d'épuisement. JS Constitution DD 13 toutes les heures ou +1 épuisement, jusqu'à des soins.",
  },
  {
    id: "vertebre-felee",
    min: 84,
    max: 84,
    severity: "grave",
    name: "Vertèbre fêlée",
    effect:
      "Désavantage à tous les jets de Force et de Dextérité jusqu'à un repos long ; déplacements lents.",
  },
  {
    id: "scalp-arrache",
    min: 85,
    max: 85,
    severity: "grave",
    name: "Scalp partiellement arraché",
    effect:
      "2d4 dégâts et désavantage à la Perception (sang dans les yeux) pendant 1 minute. Cicatrice permanente.",
  },

  // --- Critiques, non mortelles (86 à 100) ---
  {
    id: "perte-doigt",
    min: 86,
    max: 86,
    severity: "critique",
    name: "Perte d'un doigt",
    effect:
      "Vous perdez définitivement un doigt : désavantage permanent aux tests de Dextérité fine de cette main.",
  },
  {
    id: "oeil-creve",
    min: 87,
    max: 87,
    severity: "critique",
    name: "Œil crevé",
    effect:
      "Vous perdez un œil : désavantage permanent à la Perception visuelle et aux attaques à distance.",
  },
  {
    id: "oreille-tranchee",
    min: 88,
    max: 88,
    severity: "critique",
    name: "Oreille tranchée",
    effect:
      "Sourd de ce côté : désavantage permanent pour localiser les sons.",
  },
  {
    id: "main-sectionnee",
    min: 89,
    max: 89,
    severity: "critique",
    name: "Main sectionnée",
    effect:
      "Votre main est tranchée : vous ne pouvez plus rien tenir de ce côté jusqu'à une régénération magique.",
  },
  {
    id: "pied-sectionne",
    min: 90,
    max: 90,
    severity: "critique",
    name: "Pied sectionné",
    effect:
      "Votre pied est tranché : vitesse réduite à 1,50 m sans prothèse ni régénération.",
  },
  {
    id: "bras-ampute",
    min: 91,
    max: 91,
    severity: "critique",
    name: "Bras amputé",
    effect:
      "Votre bras est amputé : définitivement manchot de ce côté jusqu'à une régénération magique.",
  },
  {
    id: "jambe-amputee",
    min: 92,
    max: 92,
    severity: "critique",
    name: "Jambe amputée",
    effect:
      "Votre jambe est amputée : vous tombez à terre, vitesse 0 sans prothèse ni régénération.",
  },
  {
    id: "nez-tranche",
    min: 93,
    max: 93,
    severity: "critique",
    name: "Nez tranché",
    effect:
      "Odorat perdu et désavantage permanent au Charisme (apparence) jusqu'à une régénération magique.",
  },
  {
    id: "machoire-fracassee",
    min: 94,
    max: 94,
    severity: "critique",
    name: "Mâchoire fracassée",
    effect:
      "Vous ne pouvez plus parler ni lancer de sorts à composante verbale jusqu'à une régénération magique.",
  },
  {
    id: "moelle-touchee",
    min: 95,
    max: 95,
    severity: "critique",
    name: "Moelle épinière touchée",
    effect:
      "Vos jambes sont paralysées : vitesse 0 (vous rampez à 1,50 m) jusqu'à une guérison magique puissante.",
  },
  {
    id: "cecite",
    min: 96,
    max: 96,
    severity: "critique",
    name: "Cécité",
    effect:
      "Vous perdez la vue des deux yeux : aveuglé jusqu'à une guérison magique puissante.",
  },
  {
    id: "surdite-totale",
    min: 97,
    max: 97,
    severity: "critique",
    name: "Surdité totale",
    effect: "Vous perdez l'ouïe : assourdi jusqu'à une guérison magique.",
  },
  {
    id: "bras-paralyse",
    min: 98,
    max: 98,
    severity: "critique",
    name: "Bras paralysé",
    effect:
      "Le nerf brachial est sectionné : le bras reste paralysé jusqu'à une régénération magique.",
  },
  {
    id: "defiguration",
    min: 99,
    max: 99,
    severity: "critique",
    name: "Défiguration",
    effect:
      "Visage ravagé : désavantage permanent aux tests de Charisme (hormis Intimidation) jusqu'à une guérison magique.",
  },
  {
    id: "trauma-cranien",
    min: 100,
    max: 100,
    severity: "critique",
    name: "Trauma crânien majeur",
    effect:
      "Vous tombez inconscient et le restez 1d4 jours, sauf guérison magique. Grave mais non mortel.",
  },
];

/** Renvoie la blessure correspondant à un résultat de d100 (1 à 100). */
export function getInjuryByRoll(roll: number): Injury | undefined {
  return injuries.find((i) => roll >= i.min && roll <= i.max);
}

export function getInjuryById(id: string): Injury | undefined {
  return injuries.find((i) => i.id === id);
}
