import { NextRequest, NextResponse } from "next/server";
import { getCharacterBySlug } from "@/lib/characters";
import {
  getCharacterState,
  updateCharacterState,
  initializeCharacterState,
} from "@/lib/character-state";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { gold, silver } = await request.json();

    if (typeof gold !== "number" || typeof silver !== "number") {
      return NextResponse.json(
        { error: "gold and silver must be numbers" },
        { status: 400 }
      );
    }

    // Get character to initialize state if needed
    const character = await getCharacterBySlug(id);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Get or initialize current state from Redis
    let state = await getCharacterState(id);
    if (!state) {
      state = await initializeCharacterState(character);
    }

    const newState = await updateCharacterState(id, {
      money: { gold, silver },
    });

    if (!newState) {
      return NextResponse.json(
        { error: "Failed to update money" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      gold: newState.money.gold,
      silver: newState.money.silver,
    });
  } catch (error) {
    console.error("Failed to update money:", error);
    return NextResponse.json(
      { error: "Failed to update money" },
      { status: 500 }
    );
  }
}
