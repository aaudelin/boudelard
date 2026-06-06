"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { enemies, getEnemyById } from "@/data/enemies";
import { npcs, getNpcById } from "@/data/npcs";
import { Enemy, EnemyAttack, EnemyAbility, PowerLevel } from "@/types/enemy";
import { Npc, NpcSpell } from "@/types/npc";
import {
  CombatantKind,
  EncounterParticipant,
  EncounterParticipantState,
} from "@/types/encounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Minus,
  Shield,
  Swords,
  X,
  Lock,
  Heart,
  Zap,
  Skull,
  ChevronDown,
  ChevronUp,
  Gauge,
  Users,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PASSWORD = "liamlebg";
const SAVE_INTERVAL_MS = 10000;

const POWER_LEVELS: Record<
  PowerLevel,
  { description: string; className: string }
> = {
  "1/4": {
    description: "Très faible — 1 aventurier suffit largement",
    className: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  },
  "1/3": {
    description: "Faible — défi équilibré pour 1 aventurier",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  "1/2": {
    description: "Modéré — défi pour 2 aventuriers, sans risque de mourir",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  },
  "1": {
    description: "Standard — les 3 aventuriers le battent sans trop de risque",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  },
  "2": {
    description: "Dangereux — défi majeur pour les 3 aventuriers, risque de mort",
    className: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
};

function PowerLevelBadge({ level }: { level: PowerLevel }) {
  return (
    <Badge className={cn("gap-1", POWER_LEVELS[level].className)}>
      <Gauge className="h-3 w-3" />
      {level}
    </Badge>
  );
}

function PasswordScreen({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <CardTitle>Bestiaire du MJ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(error && "border-destructive animate-shake")}
            />
            <Button type="submit" className="w-full">
              Accéder
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Détails dépliés communs aux fiches ennemi, PNJ et rencontre
function CombatDetails({
  powerLevel,
  attacks,
  abilities,
  spells,
  immunities,
  resistances,
  vulnerabilities,
}: {
  powerLevel?: PowerLevel;
  attacks: EnemyAttack[];
  abilities: EnemyAbility[];
  spells?: NpcSpell[];
  immunities?: string[];
  resistances?: string[];
  vulnerabilities?: string[];
}) {
  return (
    <div className="space-y-3 pt-2 border-t">
      {powerLevel && (
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
            <Gauge className="h-3 w-3" />
            Puissance {powerLevel}
          </h4>
          <p className="text-sm text-muted-foreground ml-4">
            {POWER_LEVELS[powerLevel].description}
          </p>
        </div>
      )}

      {attacks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
            <Swords className="h-3 w-3" />
            Attaques
          </h4>
          {attacks.map((attack, i) => (
            <div key={i} className="text-sm text-muted-foreground ml-4">
              <span className="font-medium text-foreground">
                {attack.name}:
              </span>{" "}
              +{attack.bonus}, {attack.damage} {attack.damageType}
              {attack.range && ` (${attack.range})`}
            </div>
          ))}
        </div>
      )}

      {abilities.length > 0 && (
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
            <Zap className="h-3 w-3" />
            Capacités
          </h4>
          {abilities.map((ability, i) => (
            <div key={i} className="text-sm text-muted-foreground ml-4">
              <span className="font-medium text-foreground">
                {ability.name}:
              </span>{" "}
              {ability.description}
            </div>
          ))}
        </div>
      )}

      {spells && spells.length > 0 && (
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
            <Sparkles className="h-3 w-3" />
            Sorts
            <span className="text-xs text-muted-foreground font-normal">
              (utilisations illimitées)
            </span>
          </h4>
          {spells.map((spell, i) => (
            <div key={i} className="text-sm text-muted-foreground ml-4">
              <span className="font-medium text-foreground">
                {spell.name}:
              </span>{" "}
              {spell.description}
            </div>
          ))}
        </div>
      )}

      {immunities && immunities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-sm font-medium">Immunités:</span>
          {immunities.map((imm) => (
            <Badge key={imm} variant="destructive" className="text-xs">
              {imm}
            </Badge>
          ))}
        </div>
      )}

      {resistances && resistances.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-sm font-medium">Résistances:</span>
          {resistances.map((res) => (
            <Badge key={res} variant="secondary" className="text-xs">
              {res}
            </Badge>
          ))}
        </div>
      )}

      {vulnerabilities && vulnerabilities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-sm font-medium">Vulnérabilités:</span>
          {vulnerabilities.map((vuln) => (
            <Badge key={vuln} className="text-xs bg-yellow-500">
              {vuln}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function EnemyCard({
  enemy,
  onAdd,
}: {
  enemy: Enemy;
  onAdd: (enemy: Enemy) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="py-4">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-accent rounded"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <h3 className="font-semibold">{enemy.name}</h3>
          </div>
          <Button size="sm" onClick={() => onAdd(enemy)}>
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <PowerLevelBadge level={enemy.powerLevel} />
          <Badge variant="outline" className="gap-1">
            <Heart className="h-3 w-3" />
            {enemy.hp} PV
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            CA {enemy.ac}
          </Badge>
          {enemy.speed && (
            <Badge variant="secondary">{enemy.speed}</Badge>
          )}
        </div>

        {expanded && (
          <CombatDetails
            powerLevel={enemy.powerLevel}
            attacks={enemy.attacks}
            abilities={enemy.abilities}
            immunities={enemy.immunities}
            resistances={enemy.resistances}
            vulnerabilities={enemy.vulnerabilities}
          />
        )}
      </CardContent>
    </Card>
  );
}

function NpcCard({
  npc,
  onAdd,
}: {
  npc: Npc;
  onAdd: (npc: Npc) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="py-4 border-l-4 border-l-blue-500">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-accent rounded"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <h3 className="font-semibold">{npc.name}</h3>
          </div>
          <Button size="sm" onClick={() => onAdd(npc)}>
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <Heart className="h-3 w-3" />
            {npc.hp} PV
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            CA {npc.ac}
          </Badge>
          {npc.speed && <Badge variant="secondary">{npc.speed}</Badge>}
        </div>

        {expanded && (
          <CombatDetails
            attacks={npc.attacks}
            abilities={npc.abilities}
            spells={npc.spells}
          />
        )}
      </CardContent>
    </Card>
  );
}

function EncounterParticipantCard({
  participant,
  onHpChange,
  onRemove,
}: {
  participant: EncounterParticipant;
  onHpChange: (instanceId: string, delta: number) => void;
  onRemove: (instanceId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hpPercent = Math.max(0, (participant.currentHp / participant.hp) * 100);
  const isDead = participant.currentHp <= 0;
  const isNpc = participant.kind === "npc";

  const getHpColor = () => {
    if (isDead) return "bg-zinc-400";
    if (hpPercent > 50) return "bg-green-500";
    if (hpPercent > 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card
      className={cn(
        "py-4 border-l-4",
        isNpc ? "border-l-blue-500" : "border-l-red-500",
        isDead && "opacity-60"
      )}
    >
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-accent rounded"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <h3 className={cn("font-semibold", isDead && "line-through")}>
              {participant.label || participant.name}
            </h3>
            {isDead && <Skull className="h-4 w-4 text-muted-foreground" />}
          </div>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onRemove(participant.instanceId)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">PV</span>
            <span className="font-mono font-medium">
              {participant.currentHp} / {participant.hp}
            </span>
          </div>
          <Progress
            value={hpPercent}
            className="h-3"
            indicatorClassName={getHpColor()}
          />
          <div className="flex items-center justify-center gap-2">
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onHpChange(participant.instanceId, -10)}
            >
              -10
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onHpChange(participant.instanceId, -5)}
            >
              -5
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onHpChange(participant.instanceId, -1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onHpChange(participant.instanceId, 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onHpChange(participant.instanceId, 5)}
            >
              +5
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {participant.kind === "enemy" && (
            <PowerLevelBadge level={participant.powerLevel} />
          )}
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            CA {participant.ac}
          </Badge>
          {participant.speed && (
            <Badge variant="secondary">{participant.speed}</Badge>
          )}
        </div>

        {expanded && (
          <CombatDetails
            powerLevel={
              participant.kind === "enemy" ? participant.powerLevel : undefined
            }
            attacks={participant.attacks}
            abilities={participant.abilities}
            spells={participant.kind === "npc" ? participant.spells : undefined}
            immunities={
              participant.kind === "enemy" ? participant.immunities : undefined
            }
            resistances={
              participant.kind === "enemy" ? participant.resistances : undefined
            }
            vulnerabilities={
              participant.kind === "enemy"
                ? participant.vulnerabilities
                : undefined
            }
          />
        )}
      </CardContent>
    </Card>
  );
}

function toParticipantState(
  p: EncounterParticipant
): EncounterParticipantState {
  return {
    instanceId: p.instanceId,
    refId: p.id,
    kind: p.kind,
    currentHp: p.currentHp,
    ...(p.label ? { label: p.label } : {}),
  };
}

function BestiairePage() {
  const [encounter, setEncounter] = useState<EncounterParticipant[]>([]);
  const [view, setView] = useState<"encounter" | "bestiary" | "npcs">(
    "encounter"
  );
  const [loaded, setLoaded] = useState(false);

  const encounterRef = useRef<EncounterParticipant[]>([]);
  const dirtyRef = useRef(false);
  const loadedRef = useRef(false);

  // Persist the whole encounter to Redis (same pattern as the character sheet)
  const persist = useCallback(async () => {
    dirtyRef.current = false;
    try {
      await fetch("/api/encounter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participants: encounterRef.current.map(toParticipantState),
        }),
      });
    } catch (error) {
      console.error("Failed to save encounter:", error);
    }
  }, []);

  // Load the stored encounter and rehydrate from the static sheets
  useEffect(() => {
    fetch("/api/encounter")
      .then((res) => res.json())
      .then((data) => {
        const stored: EncounterParticipantState[] =
          data.state?.participants ?? [];
        const participants = stored
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
            } as EncounterParticipant;
          })
          .filter((p): p is EncounterParticipant => p !== null);
        setEncounter(participants);
        encounterRef.current = participants;
      })
      .catch((error) => console.error("Failed to load encounter:", error))
      .finally(() => {
        loadedRef.current = true;
        setLoaded(true);
      });
  }, []);

  // Periodic save of pending HP changes + flush on unmount
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (dirtyRef.current) persist();
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      if (dirtyRef.current) persist();
    };
  }, [persist]);

  const applyEncounter = (
    next: EncounterParticipant[],
    immediate: boolean
  ) => {
    setEncounter(next);
    encounterRef.current = next;
    if (!loadedRef.current) return;
    if (immediate) {
      persist();
    } else {
      dirtyRef.current = true;
    }
  };

  const addToEncounter = (combatant: Enemy | Npc, kind: CombatantKind) => {
    const current = encounterRef.current;
    const sameTypeCount = current.filter((e) => e.id === combatant.id).length;
    const newParticipant = {
      ...combatant,
      kind,
      instanceId: `${combatant.id}-${Date.now()}`,
      currentHp: combatant.hp,
    } as EncounterParticipant;

    // Update labels for existing participants of the same type
    if (sameTypeCount === 0) {
      applyEncounter([...current, newParticipant], true);
    } else {
      const updated = current.map((e) => {
        if (e.id === combatant.id && !e.label) {
          return { ...e, label: `${e.name} 1` };
        }
        return e;
      });
      applyEncounter(
        [
          ...updated,
          { ...newParticipant, label: `${combatant.name} ${sameTypeCount + 1}` },
        ],
        true
      );
    }
  };

  const updateHp = (instanceId: string, delta: number) => {
    applyEncounter(
      encounterRef.current.map((e) =>
        e.instanceId === instanceId
          ? { ...e, currentHp: Math.max(0, Math.min(e.hp, e.currentHp + delta)) }
          : e
      ),
      false
    );
  };

  const removeFromEncounter = (instanceId: string) => {
    applyEncounter(
      encounterRef.current.filter((e) => e.instanceId !== instanceId),
      true
    );
  };

  const clearEncounter = () => {
    applyEncounter([], true);
  };

  const npcsInEncounter = encounter.filter((p) => p.kind === "npc");
  const enemiesInEncounter = encounter.filter((p) => p.kind === "enemy");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-lg px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-center">
            Bestiaire du MJ
          </h1>
          <div className="flex gap-2 mt-4">
            <Button
              variant={view === "encounter" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setView("encounter")}
            >
              Rencontre ({encounter.length})
            </Button>
            <Button
              variant={view === "bestiary" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setView("bestiary")}
            >
              Bestiaire
            </Button>
            <Button
              variant={view === "npcs" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setView("npcs")}
            >
              PNJ
            </Button>
          </div>
        </header>

        {view === "encounter" && (
          <div className="space-y-4">
            {!loaded ? (
              <Card className="py-8">
                <CardContent className="text-center text-muted-foreground">
                  <p>Chargement de la rencontre...</p>
                </CardContent>
              </Card>
            ) : encounter.length === 0 ? (
              <Card className="py-8">
                <CardContent className="text-center text-muted-foreground">
                  <Swords className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Aucun participant dans la rencontre</p>
                  <p className="text-sm mt-1">
                    Allez dans le Bestiaire ou les PNJ pour en ajouter
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={clearEncounter}
                  >
                    Vider la rencontre
                  </Button>
                </div>

                {npcsInEncounter.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      PNJ ({npcsInEncounter.length})
                    </h2>
                    {npcsInEncounter.map((participant) => (
                      <EncounterParticipantCard
                        key={participant.instanceId}
                        participant={participant}
                        onHpChange={updateHp}
                        onRemove={removeFromEncounter}
                      />
                    ))}
                  </div>
                )}

                {enemiesInEncounter.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400 flex items-center gap-2">
                      <Swords className="h-4 w-4" />
                      Ennemis ({enemiesInEncounter.length})
                    </h2>
                    {enemiesInEncounter.map((participant) => (
                      <EncounterParticipantCard
                        key={participant.instanceId}
                        participant={participant}
                        onHpChange={updateHp}
                        onRemove={removeFromEncounter}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {view === "bestiary" && (
          <div className="space-y-4">
            {enemies.map((enemy) => (
              <EnemyCard
                key={enemy.id}
                enemy={enemy}
                onAdd={(e) => addToEncounter(e, "enemy")}
              />
            ))}
          </div>
        )}

        {view === "npcs" && (
          <div className="space-y-4">
            {npcs.map((npc) => (
              <NpcCard
                key={npc.id}
                npc={npc}
                onAdd={(n) => addToEncounter(n, "npc")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Bestiaire() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <PasswordScreen onSuccess={() => setAuthenticated(true)} />;
  }

  return <BestiairePage />;
}
