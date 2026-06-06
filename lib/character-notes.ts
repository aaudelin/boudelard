import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

function getNotesKey(characterId: string): string {
  return `character:${characterId}:notes`;
}

export async function getCharacterNotes(characterId: string): Promise<string> {
  try {
    const notes = await redis.get<string>(getNotesKey(characterId));
    return notes ?? "";
  } catch (error) {
    console.error("Failed to get character notes from Redis:", error);
    return "";
  }
}

export async function setCharacterNotes(
  characterId: string,
  notes: string
): Promise<boolean> {
  try {
    await redis.set(getNotesKey(characterId), notes);
    return true;
  } catch (error) {
    console.error("Failed to set character notes in Redis:", error);
    return false;
  }
}
