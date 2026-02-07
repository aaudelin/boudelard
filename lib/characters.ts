import { promises as fs } from "fs";
import path from "path";
import { Character } from "@/types/character";

const CHARACTERS_DIR = path.join(process.cwd(), "data", "characters");

export async function getAllCharacters(): Promise<Character[]> {
  const files = await fs.readdir(CHARACTERS_DIR);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  const characters = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(CHARACTERS_DIR, file);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content) as Character;
    })
  );

  return characters.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCharacterBySlug(
  slug: string
): Promise<Character | null> {
  const filePath = path.join(CHARACTERS_DIR, `${slug}.json`);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as Character;
  } catch {
    return null;
  }
}

export async function getAllCharacterSlugs(): Promise<string[]> {
  const files = await fs.readdir(CHARACTERS_DIR);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""));
}
