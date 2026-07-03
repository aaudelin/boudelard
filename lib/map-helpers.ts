// Helpers de la carte utilisables côté client comme côté serveur
// (pas d'import Redis ici)

import { MapRotation, MapTokenState } from "@/types/map";

export const DEFAULT_MAP_WIDTH_METERS = 30;

// Ramène une valeur quelconque à une rotation valide (0 par défaut)
export function normalizeRotation(value: unknown): MapRotation {
  const n = Number(value);
  return n === 90 || n === 180 || n === 270 ? n : 0;
}

// Dimensions affichées de l'image une fois pivotée (largeur/hauteur
// échangées pour 90° et 270°)
export function rotatedImageDims(
  width: number,
  height: number,
  rotation: number
): { width: number; height: number } {
  return rotation === 90 || rotation === 270
    ? { width: height, height: width }
    : { width, height };
}

// Fait pivoter un pion de 90° dans le sens horaire dans le repère normalisé
// de l'image (origine en haut à gauche, y vers le bas) : (x, y) -> (1 - y, x)
export function rotateToken90CW(token: MapTokenState): MapTokenState {
  return {
    x: clamp01(1 - token.y),
    y: clamp01(token.x),
    ...(token.hidden !== undefined ? { hidden: token.hidden } : {}),
  };
}

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
