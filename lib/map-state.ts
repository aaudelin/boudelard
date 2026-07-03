import { Redis } from "@upstash/redis";
import { MapImage, MapState } from "@/types/map";
import { DEFAULT_MAP_WIDTH_METERS } from "@/lib/map-helpers";

const redis = Redis.fromEnv();

// Une seule carte active à la fois, gérée par le MJ.
// L'image (gros payload) et l'état (positions, échelle) sont stockés
// séparément : les positions sont mises à jour souvent, l'image rarement.
const MAP_STATE_KEY = "map:current:state";
const MAP_IMAGE_KEY = "map:current:image";

export function getEmptyMapState(imageId: string | null = null): MapState {
  return {
    imageId,
    mapWidthMeters: DEFAULT_MAP_WIDTH_METERS,
    rotation: 0,
    tokens: {},
  };
}

export async function getMapState(): Promise<MapState | null> {
  try {
    return await redis.get<MapState>(MAP_STATE_KEY);
  } catch (error) {
    console.error("Failed to get map state from Redis:", error);
    return null;
  }
}

export async function setMapState(state: MapState): Promise<boolean> {
  try {
    await redis.set(MAP_STATE_KEY, state);
    return true;
  } catch (error) {
    console.error("Failed to set map state in Redis:", error);
    return false;
  }
}

export async function getMapImage(): Promise<MapImage | null> {
  try {
    return await redis.get<MapImage>(MAP_IMAGE_KEY);
  } catch (error) {
    console.error("Failed to get map image from Redis:", error);
    return null;
  }
}

export async function setMapImage(image: MapImage): Promise<boolean> {
  try {
    await redis.set(MAP_IMAGE_KEY, image);
    return true;
  } catch (error) {
    console.error("Failed to set map image in Redis:", error);
    return false;
  }
}

export async function deleteMapImage(): Promise<boolean> {
  try {
    await redis.del(MAP_IMAGE_KEY);
    return true;
  } catch (error) {
    console.error("Failed to delete map image from Redis:", error);
    return false;
  }
}
