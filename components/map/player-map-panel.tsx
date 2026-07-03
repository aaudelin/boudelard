"use client";

import { useEffect, useState } from "react";
import { characters } from "@/data/characters";
import { getEnemyById } from "@/data/enemies";
import { getNpcById } from "@/data/npcs";
import {
  EncounterParticipant,
  EncounterParticipantState,
} from "@/types/encounter";
import { useLiveMap } from "@/hooks/use-live-map";
import { LiveMap, MapEntity } from "@/components/map/live-map";
import {
  characterTokenId,
  participantTokenId,
  parseSpeedMeters,
  isTokenHidden,
  DEFAULT_MAP_WIDTH_METERS,
} from "@/lib/map-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Map as MapIcon } from "lucide-react";

// Même rythme de polling que la carte : le joueur voit arriver les
// pions et les déplacements des autres avec un petit delta
const ENCOUNTER_POLL_INTERVAL_MS = 4000;

interface PlayerMapPanelProps {
  characterId: string;
}

export function PlayerMapPanel({ characterId }: PlayerMapPanelProps) {
  const { state, image, loaded, updateToken } = useLiveMap();
  const [participants, setParticipants] = useState<EncounterParticipant[]>([]);

  // Suit la rencontre gérée par le MJ (lecture seule)
  useEffect(() => {
    let cancelled = false;

    const loadEncounter = async () => {
      try {
        const res = await fetch("/api/encounter");
        const data = await res.json();
        if (cancelled) return;
        const stored: EncounterParticipantState[] =
          data.state?.participants ?? [];
        const hydrated = stored
          .map((p) => {
            const ref =
              p.kind === "npc" ? getNpcById(p.refId) : getEnemyById(p.refId);
            if (!ref) return null;
            return {
              ...ref,
              kind: p.kind,
              instanceId: p.instanceId,
              currentHp: Math.max(0, Math.min(p.currentHp, ref.hp)),
              label: p.label,
              initiative: p.initiative,
            } as EncounterParticipant;
          })
          .filter((p): p is EncounterParticipant => p !== null);
        setParticipants(hydrated);
      } catch (error) {
        console.error("Failed to load encounter:", error);
      }
    };

    loadEncounter();
    const intervalId = setInterval(loadEncounter, ENCOUNTER_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  const entities: MapEntity[] = [
    ...characters.map((c) => ({
      id: characterTokenId(c.id),
      name: c.name,
      kind: "character" as const,
      speedMeters: parseSpeedMeters(c.speed),
    })),
    ...participants.map((p) => ({
      id: participantTokenId(p.instanceId),
      name: p.label || p.name,
      kind: p.kind,
      speedMeters: parseSpeedMeters(p.speed),
      dead: p.currentHp <= 0,
    })),
  ];

  const positions = state?.tokens ?? {};
  const ownTokenId = characterTokenId(characterId);

  if (!loaded) {
    return (
      <Card className="py-8">
        <CardContent className="text-center text-muted-foreground">
          <p>Chargement de la carte...</p>
        </CardContent>
      </Card>
    );
  }

  if (!image) {
    return (
      <Card className="py-8">
        <CardContent className="text-center text-muted-foreground">
          <MapIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>Aucune carte pour le moment</p>
          <p className="mt-1 text-sm">
            Le MJ n&apos;a pas encore chargé de carte
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <LiveMap
        image={image}
        mapWidthMeters={state?.mapWidthMeters ?? DEFAULT_MAP_WIDTH_METERS}
        rotation={state?.rotation ?? 0}
        entities={entities}
        positions={positions}
        canMove={(id) => id === ownTokenId}
        showHiddenTokens={false}
        onMove={(id, x, y) =>
          updateToken(id, { x, y, hidden: isTokenHidden(id, positions[id]) })
        }
      />
      <p className="text-xs text-muted-foreground">
        Vous ne pouvez déplacer que votre propre pion.
      </p>
    </div>
  );
}
