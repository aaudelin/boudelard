import { EnemyAbility, EnemyAttack } from "./enemy";

export interface NpcSpell {
  name: string;
  description: string;
}

// Fiche simplifiée pour le MJ : pas de gestion du nombre d'utilisations,
// les sorts sont considérés comme illimités (le MJ gère)
export interface Npc {
  id: string;
  name: string;
  hp: number;
  ac: number;
  speed?: string;
  attacks: EnemyAttack[];
  abilities: EnemyAbility[];
  spells?: NpcSpell[];
}
