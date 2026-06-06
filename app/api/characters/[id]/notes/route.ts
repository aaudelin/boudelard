import { NextRequest, NextResponse } from "next/server";
import { getCharacterBySlug } from "@/lib/characters";
import { setCharacterNotes } from "@/lib/character-notes";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { notes } = await request.json();

    if (typeof notes !== "string") {
      return NextResponse.json(
        { error: "notes must be a string" },
        { status: 400 }
      );
    }

    const character = await getCharacterBySlug(id);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    const success = await setCharacterNotes(id, notes);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to update notes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update notes:", error);
    return NextResponse.json(
      { error: "Failed to update notes" },
      { status: 500 }
    );
  }
}
