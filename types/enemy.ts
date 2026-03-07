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

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  ac: number;
  speed?: string;
  attacks: EnemyAttack[];
  abilities: EnemyAbility[];
  immunities?: string[];
  resistances?: string[];
  vulnerabilities?: string[];
}

export interface EncounterEnemy extends Enemy {
  instanceId: string;
  currentHp: number;
  label?: string;
}
