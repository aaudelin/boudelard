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
    const { gold, silver } = await request.json();

    if (typeof gold !== "number" || typeof silver !== "number") {
      return NextResponse.json(
        { error: "gold and silver must be numbers" },
        { status: 400 }
      );
    }

    const filePath = path.join(CHARACTERS_DIR, `${id}.json`);

    const content = await fs.readFile(filePath, "utf-8");
    const character: Character = JSON.parse(content);

    character.equipment.currency.gold = gold;
    character.equipment.currency.silver = silver;

    await fs.writeFile(filePath, JSON.stringify(character, null, 2), "utf-8");

    revalidatePath(`/character/${id}`);

    return NextResponse.json({ success: true, gold, silver });
  } catch (error) {
    console.error("Failed to update money:", error);
    return NextResponse.json(
      { error: "Failed to update money" },
      { status: 500 }
    );
  }
}
