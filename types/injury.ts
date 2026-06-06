// Gravité croissante d'une blessure : plus on monte, plus c'est grave.
// Aucune blessure n'est mortelle.
export type InjurySeverity = "légère" | "modérée" | "grave" | "critique";

export interface Injury {
  id: string;
  /** Borne basse du résultat du d100 (incluse) */
  min: number;
  /** Borne haute du résultat du d100 (incluse) */
  max: number;
  severity: InjurySeverity;
  name: string;
  /** Effet mécanique de la blessure (jets de sauvegarde, malus, etc.) */
  effect: string;
}
