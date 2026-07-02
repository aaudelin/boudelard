"use client";

import { useRef, useState } from "react";
import { MapImage, MapTokenState } from "@/types/map";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clamp01, isTokenHidden } from "@/lib/map-helpers";
import { EyeOff, Skull, ZoomIn, ZoomOut } from "lucide-react";

// Pion affiché sur la carte : les données viennent des fiches statiques
// et de la rencontre, seule la position/visibilité vient de l'état Redis
export interface MapEntity {
  id: string;
  name: string;
  kind: "character" | "npc" | "enemy";
  speedMeters: number;
  dead?: boolean;
  currentHp?: number;
  maxHp?: number;
}

// Positions par défaut tant qu'un pion n'a pas été déplacé :
// personnages en bas de la carte, PNJ/ennemis en haut
export function getDefaultPositions(
  entities: MapEntity[]
): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  const characters = entities.filter((e) => e.kind === "character");
  const others = entities.filter((e) => e.kind !== "character");
  characters.forEach((e, i) => {
    positions[e.id] = { x: (i + 1) / (characters.length + 1), y: 0.9 };
  });
  others.forEach((e, i) => {
    positions[e.id] = { x: (i + 1) / (others.length + 1), y: 0.1 };
  });
  return positions;
}

const KIND_STYLES: Record<MapEntity["kind"], string> = {
  character: "bg-emerald-600 ring-emerald-300",
  npc: "bg-blue-600 ring-blue-300",
  enemy: "bg-red-600 ring-red-300",
};

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface DragState {
  id: string;
  pointerId: number;
  originX: number;
  originY: number;
  x: number;
  y: number;
  // Décalage entre le pointeur et le centre du pion au moment de la saisie
  offsetX: number;
  offsetY: number;
  rect: DOMRect;
  moved: boolean;
}

interface LiveMapProps {
  image: MapImage;
  mapWidthMeters: number;
  entities: MapEntity[];
  positions: Record<string, MapTokenState>;
  canMove: (id: string) => boolean;
  // Le MJ voit les pions masqués (semi-transparents), pas les joueurs
  showHiddenTokens: boolean;
  showHp?: boolean;
  onMove: (id: string, x: number, y: number) => void;
  onSelect?: (id: string) => void;
}

const ZOOM_LEVELS = [1, 1.5, 2, 3];

export function LiveMap({
  image,
  mapWidthMeters,
  entities,
  positions,
  canMove,
  showHiddenTokens,
  showHp = false,
  onMove,
  onSelect,
}: LiveMapProps) {
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const defaults = getDefaultPositions(entities);
  const mapHeightMeters = mapWidthMeters * (image.height / image.width);

  const visibleEntities = entities.filter(
    (e) => showHiddenTokens || !isTokenHidden(e.id, positions[e.id])
  );

  const tokenPosition = (id: string): { x: number; y: number } => {
    if (drag && drag.id === id) {
      return { x: drag.x, y: drag.y };
    }
    return positions[id] ?? defaults[id] ?? { x: 0.5, y: 0.5 };
  };

  const handlePointerDown = (
    event: React.PointerEvent,
    entity: MapEntity
  ) => {
    if (!canMove(entity.id) || !innerRef.current) return;
    event.preventDefault();
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
    const rect = innerRef.current.getBoundingClientRect();
    const position = tokenPosition(entity.id);
    const pointerX = clamp01((event.clientX - rect.left) / rect.width);
    const pointerY = clamp01((event.clientY - rect.top) / rect.height);
    const next: DragState = {
      id: entity.id,
      pointerId: event.pointerId,
      originX: position.x,
      originY: position.y,
      x: position.x,
      y: position.y,
      offsetX: pointerX - position.x,
      offsetY: pointerY - position.y,
      rect,
      moved: false,
    };
    dragRef.current = next;
    setDrag(next);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    const current = dragRef.current;
    if (!current || event.pointerId !== current.pointerId) return;
    const { rect } = current;
    const x = clamp01(
      (event.clientX - rect.left) / rect.width - current.offsetX
    );
    const y = clamp01(
      (event.clientY - rect.top) / rect.height - current.offsetY
    );
    const movedPx = Math.hypot(
      (x - current.originX) * rect.width,
      (y - current.originY) * rect.height
    );
    const next = {
      ...current,
      x,
      y,
      moved: current.moved || movedPx > 4,
    };
    dragRef.current = next;
    setDrag(next);
  };

  const handlePointerEnd = (event: React.PointerEvent) => {
    const current = dragRef.current;
    if (!current || event.pointerId !== current.pointerId) return;
    dragRef.current = null;
    setDrag(null);
    if (current.moved) {
      onMove(current.id, current.x, current.y);
    } else {
      onSelect?.(current.id);
    }
  };

  const zoomIndex = ZOOM_LEVELS.indexOf(zoom);
  const draggedEntity = drag
    ? entities.find((e) => e.id === drag.id)
    : undefined;
  const dragDistanceMeters = drag
    ? Math.hypot(
        (drag.x - drag.originX) * mapWidthMeters,
        (drag.y - drag.originY) * mapHeightMeters
      )
    : 0;
  const overSpeed =
    draggedEntity !== undefined &&
    dragDistanceMeters > draggedEntity.speedMeters;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            Joueurs
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            PNJ
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
            Ennemis
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon-sm"
            variant="outline"
            disabled={zoomIndex <= 0}
            onClick={() => setZoom(ZOOM_LEVELS[Math.max(0, zoomIndex - 1)])}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            disabled={zoomIndex >= ZOOM_LEVELS.length - 1}
            onClick={() =>
              setZoom(
                ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, zoomIndex + 1)]
              )
            }
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative max-h-[70vh] overflow-auto rounded-lg border bg-zinc-900">
        <div
          ref={innerRef}
          className="relative"
          style={{ width: `${zoom * 100}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.dataUrl}
            alt="Carte de la rencontre"
            className="block w-full select-none"
            draggable={false}
          />

          {/* Rayon de déplacement (vitesse) autour du point de départ */}
          {drag && draggedEntity && draggedEntity.speedMeters > 0 && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-white/80 bg-white/10"
              style={{
                left: `${drag.originX * 100}%`,
                top: `${drag.originY * 100}%`,
                width: `${
                  (2 * draggedEntity.speedMeters * drag.rect.width) /
                  mapWidthMeters
                }px`,
                height: `${
                  (2 * draggedEntity.speedMeters * drag.rect.width) /
                  mapWidthMeters
                }px`,
              }}
            />
          )}

          {visibleEntities.map((entity) => {
            const position = tokenPosition(entity.id);
            const hidden = isTokenHidden(entity.id, positions[entity.id]);
            const movable = canMove(entity.id);
            const isDragged = drag?.id === entity.id;
            return (
              <button
                key={entity.id}
                type="button"
                className={cn(
                  "absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center rounded-full text-xs font-bold text-white ring-2",
                  KIND_STYLES[entity.kind],
                  movable ? "cursor-grab touch-none" : "cursor-pointer",
                  hidden && "opacity-40",
                  entity.dead && "opacity-60 grayscale",
                  isDragged && "z-30 scale-110 cursor-grabbing shadow-lg"
                )}
                style={{
                  left: `${position.x * 100}%`,
                  top: `${position.y * 100}%`,
                }}
                onPointerDown={
                  movable ? (e) => handlePointerDown(e, entity) : undefined
                }
                onPointerMove={movable ? handlePointerMove : undefined}
                onPointerUp={movable ? handlePointerEnd : undefined}
                onPointerCancel={movable ? handlePointerEnd : undefined}
                onClick={
                  !movable && onSelect
                    ? () => onSelect(entity.id)
                    : undefined
                }
              >
                {entity.dead ? (
                  <Skull className="h-4 w-4" />
                ) : (
                  initials(entity.name)
                )}
                {hidden && (
                  <EyeOff className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-background p-0.5 text-foreground" />
                )}

                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-1 text-[10px] font-medium text-white">
                  {entity.name}
                </span>

                {showHp &&
                  entity.maxHp !== undefined &&
                  entity.currentHp !== undefined && (
                    <span className="pointer-events-none absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 overflow-hidden rounded-full bg-black/60">
                      <span
                        className={cn(
                          "block h-full",
                          entity.currentHp / entity.maxHp > 0.5
                            ? "bg-green-500"
                            : entity.currentHp / entity.maxHp > 0.25
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        )}
                        style={{
                          width: `${Math.max(
                            0,
                            (entity.currentHp / entity.maxHp) * 100
                          )}%`,
                        }}
                      />
                    </span>
                  )}

                {/* Distance parcourue pendant le déplacement */}
                {isDragged && drag?.moved && (
                  <span
                    className={cn(
                      "pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-semibold text-white",
                      overSpeed ? "bg-red-600" : "bg-black/80"
                    )}
                  >
                    {dragDistanceMeters.toFixed(1)} m
                    {draggedEntity &&
                      ` / ${draggedEntity.speedMeters} m`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Échelle : la carte fait {mapWidthMeters} m de large. Le cercle
        pointillé montre la distance de déplacement (vitesse) du pion
        déplacé.
      </p>
    </div>
  );
}
