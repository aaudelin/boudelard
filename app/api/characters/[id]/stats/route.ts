import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Character } from "@/types/character";

const CHARACTERS_DIR = path.join(process.cwd(), "data", "characters");

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const filePath = path.join(CHARACTERS_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    const character: Character = JSON.parse(content);

    // Update hit points
    if (updates.hitPoints !== undefined) {
      if (typeof updates.hitPoints.current === "number") {
        character.hitPoints.current = Math.max(
          0,
          Math.min(updates.hitPoints.current, character.hitPoints.maximum)
        );
      }
      if (typeof updates.hitPoints.temporary === "number") {
        character.hitPoints.temporary = Math.max(0, updates.hitPoints.temporary);
      }
      if (typeof updates.hitPoints.hitDiceRemaining === "number") {
        const maxHitDice = character.level;
        character.hitPoints.hitDiceRemaining = Math.max(
          0,
          Math.min(updates.hitPoints.hitDiceRemaining, maxHitDice)
        );
      }
    }

    // Update spell slots
    if (updates.spellSlots && character.spellcasting) {
      updates.spellSlots.forEach(
        (slotUpdate: { level: number; expended: number }) => {
          const slot = character.spellcasting!.spellSlots.find(
            (s) => s.level === slotUpdate.level
          );
          if (slot) {
            slot.expended = Math.max(
              0,
              Math.min(slotUpdate.expended, slot.total)
            );
          }
        }
      );
    }

    await fs.writeFile(filePath, JSON.stringify(character, null, 2), "utf-8");

    revalidatePath(`/character/${id}`);

    return NextResponse.json({ success: true, character });
  } catch (error) {
    console.error("Failed to update stats:", error);
    return NextResponse.json(
      { error: "Failed to update stats" },
      { status: 500 }
    );
  }
}
