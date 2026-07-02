"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { characters } from "@/data/characters";
import { EncounterParticipant } from "@/types/encounter";
import { useLiveMap } from "@/hooks/use-live-map";
import {
  LiveMap,
  MapEntity,
  getDefaultPositions,
} from "@/components/map/live-map";
import {
  characterTokenId,
  participantTokenId,
  parseSpeedMeters,
  DEFAULT_MAP_WIDTH_METERS,
} from "@/lib/map-helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  EyeOff,
  ExternalLink,
  Heart,
  ImageUp,
  Map as MapIcon,
  Minus,
  Plus,
  Ruler,
  Shield,
  Trash2,
} from "lucide-react";

interface GmMapPanelProps {
  participants: EncounterParticipant[];
  onHpChange: (instanceId: string, delta: number) => void;
}

export function GmMapPanel({ participants, onHpChange }: GmMapPanelProps) {
  const {
    state,
    image,
    loaded,
    uploading,
    updateToken,
    setMapWidthMeters,
    uploadImage,
    removeImage,
  } = useLiveMap();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [widthInput, setWidthInput] = useState("");

  const mapWidthMeters = state?.mapWidthMeters ?? DEFAULT_MAP_WIDTH_METERS;

  // Synchronise l'input d'échelle avec la valeur stockée
  useEffect(() => {
    setWidthInput(String(mapWidthMeters));
  }, [mapWidthMeters]);

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
      currentHp: p.currentHp,
      maxHp: p.hp,
    })),
  ];

  const positions = state?.tokens ?? {};

  const toggleHidden = (id: string) => {
    const position =
      positions[id] ?? getDefaultPositions(entities)[id] ?? { x: 0.5, y: 0.5 };
    updateToken(id, {
      x: position.x,
      y: position.y,
      hidden: !positions[id]?.hidden,
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (
      image &&
      !window.confirm(
        "Remplacer la carte ? Les positions de tous les pions seront réinitialisées."
      )
    ) {
      return;
    }
    const ok = await uploadImage(file);
    if (!ok) {
      window.alert("Échec du chargement de l'image");
    }
  };

  const commitWidth = () => {
    const value = parseFloat(widthInput.replace(",", "."));
    if (Number.isFinite(value) && value > 0) {
      setMapWidthMeters(Math.min(1000, value));
    } else {
      setWidthInput(String(mapWidthMeters));
    }
  };

  const selectedEntity = entities.find((e) => e.id === selectedId);
  const selectedParticipant = participants.find(
    (p) => participantTokenId(p.instanceId) === selectedId
  );
  const selectedCharacter = characters.find(
    (c) => characterTokenId(c.id) === selectedId
  );
  const selectedHidden =
    selectedId !== null && positions[selectedId]?.hidden === true;

  return (
    <div className="space-y-4">
      <Card className="py-4">
        <CardContent className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant={image ? "outline" : "default"}
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageUp className="h-4 w-4" />
              {uploading
                ? "Chargement..."
                : image
                  ? "Remplacer la carte"
                  : "Charger une carte"}
            </Button>
            {image && (
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  if (
                    window.confirm(
                      "Supprimer la carte et réinitialiser les positions ?"
                    )
                  ) {
                    removeImage();
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 shrink-0 text-muted-foreground" />
            <label className="text-sm text-muted-foreground whitespace-nowrap">
              Largeur réelle
            </label>
            <Input
              type="number"
              inputMode="decimal"
              className="h-8 w-20 text-center font-mono"
              value={widthInput}
              onChange={(e) => setWidthInput(e.target.value)}
              onBlur={commitWidth}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
            <span className="text-sm text-muted-foreground">mètres</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Les PNJ et ennemis de l&apos;onglet Rencontre apparaissent sur la
            carte. Touchez un pion pour ses infos, glissez-le pour le
            déplacer. Changer d&apos;image réinitialise les positions.
          </p>
        </CardContent>
      </Card>

      {!loaded ? (
        <Card className="py-8">
          <CardContent className="text-center text-muted-foreground">
            <p>Chargement de la carte...</p>
          </CardContent>
        </Card>
      ) : image ? (
        <LiveMap
          image={image}
          mapWidthMeters={mapWidthMeters}
          entities={entities}
          positions={positions}
          canMove={() => true}
          showHiddenTokens
          showHp
          onMove={(id, x, y) =>
            updateToken(id, {
              x,
              y,
              ...(positions[id]?.hidden ? { hidden: true } : {}),
            })
          }
          onSelect={setSelectedId}
        />
      ) : (
        <Card className="py-8">
          <CardContent className="text-center text-muted-foreground">
            <MapIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>Aucune carte chargée</p>
            <p className="mt-1 text-sm">
              Chargez une image générée avec votre outil externe
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <DialogContent className="max-w-sm">
          {selectedEntity && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEntity.name}</DialogTitle>
              </DialogHeader>

              {selectedParticipant && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">PV</span>
                      <span className="font-mono font-medium">
                        {selectedParticipant.currentHp} /{" "}
                        {selectedParticipant.hp}
                      </span>
                    </div>
                    <Progress
                      value={Math.max(
                        0,
                        (selectedParticipant.currentHp /
                          selectedParticipant.hp) *
                          100
                      )}
                      className="h-3"
                    />
                    <div className="flex items-center justify-center gap-2">
                      {[-10, -5, -1, 1, 5].map((delta) => (
                        <Button
                          key={delta}
                          size="icon-sm"
                          variant="outline"
                          onClick={() =>
                            onHpChange(selectedParticipant.instanceId, delta)
                          }
                        >
                          {delta === -1 ? (
                            <Minus className="h-3 w-3" />
                          ) : delta === 1 ? (
                            <Plus className="h-3 w-3" />
                          ) : (
                            `${delta > 0 ? "+" : ""}${delta}`
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      CA {selectedParticipant.ac}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Heart className="h-3 w-3" />
                      {selectedParticipant.hp} PV max
                    </Badge>
                    {selectedParticipant.speed && (
                      <Badge variant="secondary">
                        {selectedParticipant.speed}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {selectedCharacter && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {selectedCharacter.race} — niveau{" "}
                    {selectedCharacter.level}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      CA {selectedCharacter.armorClass}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedCharacter.speed} m
                    </Badge>
                  </div>
                  <Link
                    href={`/character/${selectedCharacter.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Voir la fiche
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => selectedId && toggleHidden(selectedId)}
              >
                {selectedHidden ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Afficher sur la carte des joueurs
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Masquer aux joueurs
                  </>
                )}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
