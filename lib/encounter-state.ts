import { Redis } from "@upstash/redis";
import { EncounterState } from "@/types/encounter";

const redis = Redis.fromEnv();

// Une seule rencontre active à la fois, gérée par le MJ
const ENCOUNTER_KEY = "encounter:current:state";

export async function getEncounterState(): Promise<EncounterState | null> {
  try {
    const state = await redis.get<EncounterState>(ENCOUNTER_KEY);
    return state;
  } catch (error) {
    console.error("Failed to get encounter state from Redis:", error);
    return null;
  }
}

export async function setEncounterState(
  state: EncounterState
): Promise<boolean> {
  try {
    await redis.set(ENCOUNTER_KEY, state);
    return true;
  } catch (error) {
    console.error("Failed to set encounter state in Redis:", error);
    return false;
  }
}
