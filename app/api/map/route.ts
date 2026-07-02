import { NextRequest, NextResponse } from "next/server";
import { getMapState, setMapState, getEmptyMapState } from "@/lib/map-state";
import { MapState, MapTokenState } from "@/types/map";
import { clamp01 } from "@/lib/map-helpers";

const MAX_TOKENS = 200;
const MAX_TOKEN_ID_LENGTH = 120;

export async function GET() {
  const state = await getMapState();
  return NextResponse.json({ state: state ?? getEmptyMapState() });
}

// Mise à jour partielle : positions/visibilité des pions et échelle.
// Même approche que la rencontre : dernier écrivain gagne, le petit
// delta de rafraîchissement est accepté.
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const state: MapState = (await getMapState()) ?? getEmptyMapState();

    // Un client resté sur une ancienne image ne doit pas écraser les
    // positions réinitialisées : on lui renvoie l'état courant
    if ("imageId" in body && body.imageId !== state.imageId) {
      return NextResponse.json({ state, stale: true });
    }

    if (body.tokens && typeof body.tokens === "object") {
      for (const [id, token] of Object.entries(body.tokens)) {
        if (typeof id !== "string" || id.length > MAX_TOKEN_ID_LENGTH) continue;
        if (!token || typeof token !== "object") continue;
        const t = token as Partial<MapTokenState>;
        if (!Number.isFinite(Number(t.x)) || !Number.isFinite(Number(t.y))) {
          continue;
        }
        if (
          Object.keys(state.tokens).length >= MAX_TOKENS &&
          !state.tokens[id]
        ) {
          continue;
        }
        state.tokens[id] = {
          x: clamp01(Number(t.x)),
          y: clamp01(Number(t.y)),
          ...(typeof t.hidden === "boolean" ? { hidden: t.hidden } : {}),
        };
      }
    }

    if (Number.isFinite(Number(body.mapWidthMeters))) {
      state.mapWidthMeters = Math.max(
        1,
        Math.min(1000, Number(body.mapWidthMeters))
      );
    }

    const saved = await setMapState(state);
    if (!saved) {
      return NextResponse.json(
        { error: "Failed to save map state" },
        { status: 500 }
      );
    }

    return NextResponse.json({ state });
  } catch (error) {
    console.error("Failed to update map state:", error);
    return NextResponse.json(
      { error: "Failed to update map state" },
      { status: 500 }
    );
  }
}
