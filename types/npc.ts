import { EnemyAbility, EnemyAttack, PowerLevel } from "./enemy";

export interface NpcSpell {
  name: string;
  description: string;
}

// Fiche simplifiée pour le MJ : pas de gestion du nombre d'utilisations,
// les sorts sont considérés comme illimités (le MJ gère)
export interface Npc {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hp: number;
  ac: number;
  // Difficulté pour les 3 aventuriers de le vaincre si le PNJ devient inamical
  powerLevel: PowerLevel;
  speed?: string;
  attacks: EnemyAttack[];
  abilities: EnemyAbility[];
  spells?: NpcSpell[];
}
