import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  getMapState,
  setMapState,
  getMapImage,
  setMapImage,
  deleteMapImage,
  getEmptyMapState,
} from "@/lib/map-state";
import { MapImage, MapState } from "@/types/map";
import { DEFAULT_MAP_WIDTH_METERS } from "@/lib/map-helpers";

// L'image est compressée côté client ; on garde une marge sous la limite
// de 1 Mo par requête d'Upstash
const MAX_DATA_URL_CHARS = 950_000;

export async function GET() {
  const image = await getMapImage();
  return NextResponse.json({ image });
}

// Remplace l'unique image stockée : les positions sont réinitialisées,
// seule l'échelle est conservée
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { dataUrl, width, height } = body;

    if (
      typeof dataUrl !== "string" ||
      !dataUrl.startsWith("data:image/") ||
      dataUrl.length > MAX_DATA_URL_CHARS
    ) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
    if (
      !Number.isFinite(Number(width)) ||
      !Number.isFinite(Number(height)) ||
      Number(width) <= 0 ||
      Number(height) <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid dimensions" },
        { status: 400 }
      );
    }

    const image: MapImage = {
      id: randomUUID(),
      dataUrl,
      width: Math.round(Number(width)),
      height: Math.round(Number(height)),
    };

    const savedImage = await setMapImage(image);
    if (!savedImage) {
      return NextResponse.json(
        { error: "Failed to save image" },
        { status: 500 }
      );
    }

    const previous = await getMapState();
    const state: MapState = {
      imageId: image.id,
      mapWidthMeters: previous?.mapWidthMeters ?? DEFAULT_MAP_WIDTH_METERS,
      rotation: 0,
      tokens: {},
    };
    await setMapState(state);

    // Pas d'écho du dataUrl (le client l'a déjà)
    return NextResponse.json({
      image: { id: image.id, width: image.width, height: image.height },
      state,
    });
  } catch (error) {
    console.error("Failed to upload map image:", error);
    return NextResponse.json(
      { error: "Failed to upload map image" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await deleteMapImage();
    const previous = await getMapState();
    const state = getEmptyMapState();
    state.mapWidthMeters =
      previous?.mapWidthMeters ?? DEFAULT_MAP_WIDTH_METERS;
    await setMapState(state);
    return NextResponse.json({ state });
  } catch (error) {
    console.error("Failed to delete map image:", error);
    return NextResponse.json(
      { error: "Failed to delete map image" },
      { status: 500 }
    );
  }
}
