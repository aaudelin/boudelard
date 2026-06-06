import { Enemy } from "./enemy";
import { Npc } from "./npc";

export type CombatantKind = "enemy" | "npc";

// Participant à la rencontre, hydraté côté client à partir des données
// statiques (data/enemies.ts ou data/npcs.ts) + l'état Redis
export type EncounterParticipant = (
  | (Enemy & { kind: "enemy" })
  | (Npc & { kind: "npc" })
) & {
  instanceId: string;
  currentHp: number;
  label?: string;
  initiative?: number;
};

// Forme minimale persistée dans Redis : juste de quoi retrouver la fiche
// et le niveau de vie courant
export interface EncounterParticipantState {
  instanceId: string;
  refId: string;
  kind: CombatantKind;
  currentHp: number;
  label?: string;
  initiative?: number;
}

export interface EncounterState {
  participants: EncounterParticipantState[];
  // Initiatives des personnages joueurs, propres à la rencontre
  // (jamais stockées dans la fiche de personnage), clé = id du personnage
  characterInitiatives?: Record<string, number>;
}
