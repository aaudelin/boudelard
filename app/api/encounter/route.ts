import { NextRequest, NextResponse } from "next/server";
import { getEncounterState, setEncounterState } from "@/lib/encounter-state";
import { EncounterParticipantState } from "@/types/encounter";
import { getEnemyById } from "@/data/enemies";
import { getNpcById } from "@/data/npcs";

export async function GET() {
  const state = await getEncounterState();
  return NextResponse.json({ state: state ?? { participants: [] } });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const participants: EncounterParticipantState[] = Array.isArray(
      body.participants
    )
      ? body.participants
      : [];

    // Validate refs and clamp HP against the static sheet (same as character stats)
    const sanitized: EncounterParticipantState[] = [];
    for (const p of participants) {
      if (typeof p.instanceId !== "string" || typeof p.refId !== "string") {
        continue;
      }
      const ref =
        p.kind === "npc" ? getNpcById(p.refId) : getEnemyById(p.refId);
      if (!ref) continue;

      sanitized.push({
        instanceId: p.instanceId,
        refId: p.refId,
        kind: p.kind,
        currentHp: Math.max(0, Math.min(Number(p.currentHp) || 0, ref.hp)),
        ...(typeof p.label === "string" ? { label: p.label } : {}),
      });
    }

    const saved = await setEncounterState({ participants: sanitized });
    if (!saved) {
      return NextResponse.json(
        { error: "Failed to save encounter" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update encounter:", error);
    return NextResponse.json(
      { error: "Failed to update encounter" },
      { status: 500 }
    );
  }
}
