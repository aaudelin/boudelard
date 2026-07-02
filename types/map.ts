// Position d'un pion sur la carte, normalisée par rapport à l'image
// (0..1 en x et y) pour rester indépendante de la taille d'affichage.
// Clé du pion : "character:<id>" ou "participant:<instanceId>"
export interface MapTokenState {
  x: number;
  y: number;
  hidden?: boolean;
}

// État de la carte persisté dans Redis (petit payload, mis à jour souvent)
export interface MapState {
  // Id de l'image active : un changement d'image réinitialise les positions
  imageId: string | null;
  // Largeur réelle représentée par l'image, en mètres (échelle)
  mapWidthMeters: number;
  tokens: Record<string, MapTokenState>;
}

// Image de fond persistée dans Redis (gros payload, mis à jour rarement)
export interface MapImage {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
}
