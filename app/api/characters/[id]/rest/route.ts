import { NextRequest, NextResponse } from "next/server";
import { getCharacterBySlug } from "@/lib/characters";
import {
  setCharacterState,
  initializeCharacterState,
  getFeatureUsesDefinitions,
  CharacterState,
} from "@/lib/character-state";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { type } = await request.json();

    if (type !== "short" && type !== "long") {
      return NextResponse.json(
        { error: "Invalid rest type. Use 'short' or 'long'" },
        { status: 400 }
      );
    }

    // Get static character data
    const character = await getCharacterBySlug(id);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Get or initialize current state from Redis (reconciled with the JSON)
    const state = await initializeCharacterState(character);

    const newState: CharacterState = { ...state };
    const featureUsesDefinitions = getFeatureUsesDefinitions(character);

    if (type === "short") {
      // Short Rest (Repos Court):
      // - Warlock spell slots recover (Pact Magic)
      // - Can spend hit dice (handled by user manually)
      // - Features that recover on a short rest reset
      if (character.spellcasting && character.class === "warlock") {
        newState.spellSlots = state.spellSlots.map((slot) => ({
          ...slot,
          expended: 0,
        }));
      }

      newState.featureUses = state.featureUses.map((use) => {
        const definition = featureUsesDefinitions.find(
          (d) => d.key === use.key
        );
        return definition?.recovery === "short" ? { ...use, expended: 0 } : use;
      });
    } else if (type === "long") {
      // Long Rest (Repos Long):
      // - Recover all HP
      // - Recover half of max hit dice (minimum 1)
      // - Recover all spell slots
      newState.hitPoints = {
        current: character.hitPoints.maximum,
        temporary: 0,
        hitDiceRemaining: Math.min(
          character.level,
          state.hitPoints.hitDiceRemaining +
            Math.max(1, Math.floor(character.level / 2))
        ),
      };

      // Recover all spell slots
      if (character.spellcasting) {
        newState.spellSlots = state.spellSlots.map((slot) => ({
          ...slot,
          expended: 0,
        }));
      }

      // Recover all limited-use features (a long rest also restores
      // features that recover on a short rest)
      newState.featureUses = state.featureUses.map((use) => ({
        ...use,
        expended: 0,
      }));
    }

    const success = await setCharacterState(id, newState);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to apply rest" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, state: newState });
  } catch (error) {
    console.error("Failed to apply rest:", error);
    return NextResponse.json(
      { error: "Failed to apply rest" },
      { status: 500 }
    );
  }
}
