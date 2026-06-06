export interface EnemyAbility {
  name: string;
  description: string;
}

export interface EnemyAttack {
  name: string;
  bonus: number;
  damage: string;
  damageType: string;
  range?: string;
}

// Niveau de puissance relatif à l'équipe de 3 aventuriers :
// "1/4" = très faible, 1 aventurier suffit largement
// "1/3" = faible, 1 aventurier en fait un défi équilibré
// "1/2" = modéré, 2 aventuriers pour un défi sans risque de mourir
// "1"   = standard, les 3 aventuriers le battent sans trop de risque
// "2"   = dangereux, défi majeur pour les 3 aventuriers, risque de mort
export type PowerLevel = "1/4" | "1/3" | "1/2" | "1" | "2";

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  ac: number;
  powerLevel: PowerLevel;
  speed?: string;
  attacks: EnemyAttack[];
  abilities: EnemyAbility[];
  immunities?: string[];
  resistances?: string[];
  vulnerabilities?: string[];
}

