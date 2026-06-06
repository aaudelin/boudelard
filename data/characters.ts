import { Character } from "@/types/character";
import drogo from "./characters/drogo-malaufoie.json";
import germione from "./characters/germione-hangar.json";
import ginny from "./characters/ginny-bezley.json";

// Import statique des fiches pour les composants client (le chargement
// via fs de lib/characters.ts reste réservé au serveur)
export const characters: Character[] = (
  [drogo, germione, ginny] as Character[]
).sort((a, b) => a.name.localeCompare(b.name));

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}
