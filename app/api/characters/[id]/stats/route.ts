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
    const updates = await request.json();

    // Get static character data for validation (max HP, max hit dice, etc.)
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

    // Build updates object
    const stateUpdates: Parameters<typeof updateCharacterState>[1] = {};

    // Update hit points
    if (updates.hitPoints !== undefined) {
      stateUpdates.hitPoints = { ...state.hitPoints };

      if (typeof updates.hitPoints.current === "number") {
        stateUpdates.hitPoints.current = Math.max(
          0,
          Math.min(updates.hitPoints.current, character.hitPoints.maximum)
        );
      }
      if (typeof updates.hitPoints.temporary === "number") {
        stateUpdates.hitPoints.temporary = Math.max(
          0,
          updates.hitPoints.temporary
        );
      }
      if (typeof updates.hitPoints.hitDiceRemaining === "number") {
        const maxHitDice = character.level;
        stateUpdates.hitPoints.hitDiceRemaining = Math.max(
          0,
          Math.min(updates.hitPoints.hitDiceRemaining, maxHitDice)
        );
      }
    }

    // Update spell slots
    if (updates.spellSlots && character.spellcasting) {
      const newSlots = state.spellSlots.map((slot) => {
        const update = updates.spellSlots.find(
          (u: { level: number; expended: number }) => u.level === slot.level
        );
        if (update) {
          const maxSlots =
            character.spellcasting!.spellSlots.find(
              (s) => s.level === slot.level
            )?.total || 0;
          return {
            ...slot,
            expended: Math.max(0, Math.min(update.expended, maxSlots)),
          };
        }
        return slot;
      });
      stateUpdates.spellSlots = newSlots;
    }

    // Update money
    if (updates.money !== undefined) {
      stateUpdates.money = {
        gold: Math.max(0, updates.money.gold ?? state.money.gold),
        silver: Math.max(0, updates.money.silver ?? state.money.silver),
      };
    }

    const newState = await updateCharacterState(id, stateUpdates);
    if (!newState) {
      return NextResponse.json(
        { error: "Failed to update state" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, state: newState });
  } catch (error) {
    console.error("Failed to update stats:", error);
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  }
}
