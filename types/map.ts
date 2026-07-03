// Position d'un pion sur la carte, normalisée par rapport à l'image
// (0..1 en x et y) pour rester indépendante de la taille d'affichage.
// Clé du pion : "character:<id>" ou "participant:<instanceId>"
export interface MapTokenState {
  x: number;
  y: number;
  hidden?: boolean;
}

// Rotation d'affichage de l'image, en degrés horaires. L'image stockée
// n'est pas réencodée : on la fait juste pivoter à l'affichage (MJ + joueurs)
export type MapRotation = 0 | 90 | 180 | 270;

// État de la carte persisté dans Redis (petit payload, mis à jour souvent)
export interface MapState {
  // Id de l'image active : un changement d'image réinitialise les positions
  imageId: string | null;
  // Largeur réelle représentée par l'image, en mètres (échelle)
  mapWidthMeters: number;
  // Orientation appliquée à l'affichage (0 par défaut / anciens états)
  rotation?: MapRotation;
  tokens: Record<string, MapTokenState>;
}

// Image de fond persistée dans Redis (gros payload, mis à jour rarement)
export interface MapImage {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
}
