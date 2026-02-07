import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Character } from "@/types/character";

const CHARACTERS_DIR = path.join(process.cwd(), "data", "characters");

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

    const filePath = path.join(CHARACTERS_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    const character: Character = JSON.parse(content);

    if (type === "short") {
      // Short Rest (Repos Court):
      // - Warlock spell slots recover (Pact Magic)
      // - Can spend hit dice (handled by user manually)
      // - Some class features recover
      if (character.spellcasting && character.class === "warlock") {
        character.spellcasting.spellSlots.forEach((slot) => {
          slot.expended = 0;
        });
      }
    } else if (type === "long") {
      // Long Rest (Repos Long):
      // - Recover all HP
      // - Recover half of max hit dice (minimum 1)
      // - Recover all spell slots
      character.hitPoints.current = character.hitPoints.maximum;
      character.hitPoints.temporary = 0;

      // Recover half hit dice (minimum 1)
      const maxHitDice = character.level;
      const hitDiceToRecover = Math.max(1, Math.floor(maxHitDice / 2));
      character.hitPoints.hitDiceRemaining = Math.min(
        maxHitDice,
        character.hitPoints.hitDiceRemaining + hitDiceToRecover
      );

      // Recover all spell slots
      if (character.spellcasting) {
        character.spellcasting.spellSlots.forEach((slot) => {
          slot.expended = 0;
        });
      }
    }

    await fs.writeFile(filePath, JSON.stringify(character, null, 2), "utf-8");

    revalidatePath(`/character/${id}`);

    return NextResponse.json({ success: true, character });
  } catch (error) {
    console.error("Failed to apply rest:", error);
    return NextResponse.json(
      { error: "Failed to apply rest" },
      { status: 500 }
    );
  }
}
