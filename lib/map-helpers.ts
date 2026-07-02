// Helpers de la carte utilisables côté client comme côté serveur
// (pas d'import Redis ici)

import { MapTokenState } from "@/types/map";

export const DEFAULT_MAP_WIDTH_METERS = 30;

// Les PNJ et ennemis sont masqués par défaut sur la carte des joueurs :
// le MJ les révèle explicitement. Les personnages joueurs sont visibles.
export function isTokenHidden(id: string, token?: MapTokenState): boolean {
  return token?.hidden ?? id.startsWith("participant:");
}

export function characterTokenId(characterId: string): string {
  return `character:${characterId}`;
}

export function participantTokenId(instanceId: string): string {
  return `participant:${instanceId}`;
}

// Vitesse de déplacement en mètres : nombre pour les personnages (ex: 9),
// texte libre pour les PNJ/ennemis (ex: "Vol 12m", "Immobile")
export function parseSpeedMeters(speed: string | number | undefined): number {
  if (typeof speed === "number") return speed;
  if (!speed) return 9;
  const match = speed.match(/(\d+(?:[.,]\d+)?)/);
  return match ? parseFloat(match[1].replace(",", ".")) : 0;
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
