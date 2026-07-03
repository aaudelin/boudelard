"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { enemies, getEnemyById } from "@/data/enemies";
import { npcs, getNpcById } from "@/data/npcs";
import { characters } from "@/data/characters";
import {
  AbilityKey,
  AbilityScores,
  CombatantSkill,
  Enemy,
  EnemyAttack,
  EnemyAbility,
  PowerLevel,
} from "@/types/enemy";
import {
  CompactStats,
  combatantCompactAbilities,
} from "@/components/encounter/compact-stats";
import { Npc, NpcSpell } from "@/types/npc";
import {
  CombatantKind,
  EncounterParticipant,
  EncounterParticipantState,
} from "@/types/encounter";
import { CharacterEncounterCard } from "@/components/encounter/character-encounter-card";
import {
  GmMapPanel,
  buildGmMapEntities,
} from "@/components/map/gm-map-panel";
import { getDefaultPositions } from "@/components/map/live-map";
import { useLiveMap } from "@/hooks/use-live-map";
import { isTokenHidden, participantTokenId } from "@/lib/map-helpers";
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
  Sparkles,
  Dices,
  Map as MapIcon,
  Eye,
  EyeOff,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatModifier } from "@/lib/dnd-helpers";
import { Character } from "@/types/character";

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

// Ordre croissant de puissance pour l'affichage des filtres
const POWER_LEVEL_ORDER: PowerLevel[] = ["1/4", "1/3", "1/2", "1", "2"];

function PowerLevelBadge({ level }: { level: PowerLevel }) {
  return (
    <Badge className={cn("gap-1", POWER_LEVELS[level].className)}>
      <Gauge className="h-3 w-3" />
      {level}
    </Badge>
  );
}

// Barre de recherche + filtres de puissance partagée entre Bestiaire et PNJ
function CombatantFilters({
  search,
  onSearchChange,
  selectedPowers,
  onTogglePower,
  onReset,
  total,
  shown,
  noun,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  selectedPowers: PowerLevel[];
  onTogglePower: (level: PowerLevel) => void;
  onReset: () => void;
  total: number;
  shown: number;
  noun: { singular: string; plural: string };
}) {
  const hasFilters = search.trim() !== "" || selectedPowers.length > 0;

  return (
    <div className="space-y-3 rounded-lg border bg-card p-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher par nom..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            type="button"
            aria-label="Effacer la recherche"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="h-3 w-3" />
          Puissance
        </span>
        {POWER_LEVEL_ORDER.map((level) => {
          const active = selectedPowers.includes(level);
          return (
            <button
              key={level}
              type="button"
              aria-pressed={active}
              title={POWER_LEVELS[level].description}
              onClick={() => onTogglePower(level)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                active
                  ? cn(POWER_LEVELS[level].className, "border-transparent ring-2 ring-primary/50")
                  : "border-border text-muted-foreground hover:bg-accent"
              )}
            >
              <Gauge className="h-3 w-3" />
              {level}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {shown} / {total} {shown > 1 ? noun.plural : noun.singular}
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="font-medium text-primary hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
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
          <CardTitle>Espace MJ</CardTitle>
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
  abilityScores,
  savingThrows,
  skills,
  attacks,
  abilities,
  spells,
  immunities,
  resistances,
  vulnerabilities,
}: {
  powerLevel?: PowerLevel;
  abilityScores?: AbilityScores;
  savingThrows?: Partial<Record<AbilityKey, number>>;
  skills?: CombatantSkill[];
  attacks: EnemyAttack[];
  abilities: EnemyAbility[];
  spells?: NpcSpell[];
  immunities?: string[];
  resistances?: string[];
  vulnerabilities?: string[];
}) {
  return (
    <div className="space-y-3 pt-2 border-t">
      {abilityScores && (
        <CompactStats
          abilities={combatantCompactAbilities(abilityScores, savingThrows)}
          skills={skills ?? []}
        />
      )}

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
            abilityScores={enemy.abilityScores}
            savingThrows={enemy.savingThrows}
            skills={enemy.skills}
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

        <p className="text-sm text-muted-foreground">
          {npc.race} — {npc.class} niveau {npc.level}
        </p>

        <div className="flex flex-wrap gap-2">
          <PowerLevelBadge level={npc.powerLevel} />
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
            powerLevel={npc.powerLevel}
            abilityScores={npc.abilityScores}
            savingThrows={npc.savingThrows}
            skills={npc.skills}
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
  hiddenOnMap,
  onHpChange,
  onInitiativeChange,
  onToggleHidden,
  onRemove,
}: {
  participant: EncounterParticipant;
  hiddenOnMap: boolean;
  onHpChange: (instanceId: string, delta: number) => void;
  onInitiativeChange: (instanceId: string, value: number | undefined) => void;
  onToggleHidden: (instanceId: string) => void;
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
          <div className="flex items-center gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              title={
                hiddenOnMap
                  ? "Masqué sur la carte des joueurs"
                  : "Visible sur la carte des joueurs"
              }
              onClick={() => onToggleHidden(participant.instanceId)}
            >
              {hiddenOnMap ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-emerald-600" />
              )}
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => onRemove(participant.instanceId)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
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

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Initiative</label>
          <Input
            type="number"
            className="w-16 h-8 text-center font-mono"
            value={participant.initiative ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              onInitiativeChange(
                participant.instanceId,
                raw === "" ? undefined : Number(raw)
              );
            }}
          />
          <span className="text-xs text-muted-foreground">
            (mod. {formatModifier(participant.initiativeBonus ?? 0)})
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <PowerLevelBadge level={participant.powerLevel} />
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
            powerLevel={participant.powerLevel}
            abilityScores={participant.abilityScores}
            savingThrows={participant.savingThrows}
            skills={participant.skills}
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
    ...(p.initiative !== undefined ? { initiative: p.initiative } : {}),
  };
}

// Tri par initiative décroissante, les participants sans initiative en dernier
function byInitiativeDesc(
  a: { initiative?: number },
  b: { initiative?: number }
) {
  return (b.initiative ?? -Infinity) - (a.initiative ?? -Infinity);
}

function BestiairePage() {
  const [encounter, setEncounter] = useState<EncounterParticipant[]>([]);
  const [characterInitiatives, setCharacterInitiatives] = useState<
    Record<string, number>
  >({});
  const [view, setView] = useState<"encounter" | "map" | "bestiary" | "npcs">(
    "encounter"
  );
  const [loaded, setLoaded] = useState(false);

  // Recherche par nom + filtres de puissance, partagés entre Bestiaire et PNJ
  const [search, setSearch] = useState("");
  const [powerFilter, setPowerFilter] = useState<PowerLevel[]>([]);

  const togglePowerFilter = (level: PowerLevel) => {
    setPowerFilter((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setPowerFilter([]);
  };

  const matchesFilters = useCallback(
    (c: { name: string; powerLevel: PowerLevel }) => {
      const query = search.trim().toLowerCase();
      if (query && !c.name.toLowerCase().includes(query)) return false;
      if (powerFilter.length > 0 && !powerFilter.includes(c.powerLevel))
        return false;
      return true;
    },
    [search, powerFilter]
  );

  const filteredEnemies = useMemo(
    () => enemies.filter(matchesFilters),
    [matchesFilters]
  );
  const filteredNpcs = useMemo(
    () => npcs.filter(matchesFilters),
    [matchesFilters]
  );

  // État de la carte partagé entre l'onglet Rencontre (bouton œil)
  // et l'onglet Carte
  const map = useLiveMap();

  const encounterRef = useRef<EncounterParticipant[]>([]);
  const characterInitiativesRef = useRef<Record<string, number>>({});
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
          characterInitiatives: characterInitiativesRef.current,
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
              initiative: p.initiative,
            } as EncounterParticipant;
          })
          .filter((p): p is EncounterParticipant => p !== null);
        setEncounter(participants);
        encounterRef.current = participants;
        const storedInitiatives: Record<string, number> =
          data.state?.characterInitiatives ?? {};
        setCharacterInitiatives(storedInitiatives);
        characterInitiativesRef.current = storedInitiatives;
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

  const updateInitiative = (instanceId: string, value: number | undefined) => {
    applyEncounter(
      encounterRef.current.map((e) =>
        e.instanceId === instanceId ? { ...e, initiative: value } : e
      ),
      false
    );
  };

  const setCharacterInitiative = (id: string, value: number | undefined) => {
    const next = { ...characterInitiativesRef.current };
    if (value === undefined) {
      delete next[id];
    } else {
      next[id] = value;
    }
    setCharacterInitiatives(next);
    characterInitiativesRef.current = next;
    if (loadedRef.current) dirtyRef.current = true;
  };

  // Simule un jet de 1d20 + bonus pour chaque PNJ et ennemi de la rencontre
  const rollInitiative = () => {
    applyEncounter(
      encounterRef.current.map((e) => ({
        ...e,
        initiative:
          1 + Math.floor(Math.random() * 20) + (e.initiativeBonus ?? 0),
      })),
      true
    );
  };

  // Bascule la visibilité du pion sur la carte des joueurs
  // (masqué par défaut tant que le MJ ne l'a pas révélé)
  const toggleParticipantHidden = (instanceId: string) => {
    const tokenId = participantTokenId(instanceId);
    const token = map.state?.tokens[tokenId];
    const position =
      token ??
      getDefaultPositions(buildGmMapEntities(encounterRef.current))[tokenId] ??
      { x: 0.5, y: 0.5 };
    map.updateToken(tokenId, {
      x: position.x,
      y: position.y,
      hidden: !isTokenHidden(tokenId, token),
    });
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

  // Ordre global de la rencontre : personnages, PNJ et ennemis mélangés,
  // triés par initiative décroissante (le code couleur distingue les types)
  type EncounterRow =
    | { type: "character"; character: Character; initiative?: number }
    | { type: "participant"; participant: EncounterParticipant; initiative?: number };

  const encounterRows: EncounterRow[] = [
    ...characters.map((c) => ({
      type: "character" as const,
      character: c,
      initiative: characterInitiatives[c.id],
    })),
    ...encounter.map((p) => ({
      type: "participant" as const,
      participant: p,
      initiative: p.initiative,
    })),
  ].sort(byInitiativeDesc);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-lg px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-center">
            Espace MJ
          </h1>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button
              variant={view === "encounter" ? "default" : "outline"}
              onClick={() => setView("encounter")}
            >
              Rencontre ({encounter.length})
            </Button>
            <Button
              variant={view === "map" ? "default" : "outline"}
              onClick={() => setView("map")}
            >
              <MapIcon className="h-4 w-4" />
              Carte
            </Button>
            <Button
              variant={view === "bestiary" ? "default" : "outline"}
              onClick={() => setView("bestiary")}
            >
              Bestiaire
            </Button>
            <Button
              variant={view === "npcs" ? "default" : "outline"}
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
            ) : (
              <>
                {encounter.length > 0 && (
                  <div className="flex justify-between">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={rollInitiative}
                    >
                      <Dices className="h-4 w-4" />
                      Lancer les initiatives
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={clearEncounter}
                    >
                      Vider la rencontre
                    </Button>
                  </div>
                )}

                {encounterRows.map((row) =>
                  row.type === "character" ? (
                    <CharacterEncounterCard
                      key={row.character.id}
                      character={row.character}
                      initiative={row.initiative}
                      onInitiativeChange={setCharacterInitiative}
                    />
                  ) : (
                    <EncounterParticipantCard
                      key={row.participant.instanceId}
                      participant={row.participant}
                      hiddenOnMap={isTokenHidden(
                        participantTokenId(row.participant.instanceId),
                        map.state?.tokens[
                          participantTokenId(row.participant.instanceId)
                        ]
                      )}
                      onHpChange={updateHp}
                      onInitiativeChange={updateInitiative}
                      onToggleHidden={toggleParticipantHidden}
                      onRemove={removeFromEncounter}
                    />
                  )
                )}

                {encounter.length === 0 && (
                  <Card className="py-8">
                    <CardContent className="text-center text-muted-foreground">
                      <Swords className="mx-auto h-12 w-12 mb-2 opacity-50" />
                      <p>Aucun PNJ ni ennemi dans la rencontre</p>
                      <p className="text-sm mt-1">
                        Allez dans le Bestiaire ou les PNJ pour en ajouter
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {view === "map" && (
          <GmMapPanel
            participants={encounter}
            onHpChange={updateHp}
            map={map}
          />
        )}

        {view === "bestiary" && (
          <div className="space-y-4">
            <CombatantFilters
              search={search}
              onSearchChange={setSearch}
              selectedPowers={powerFilter}
              onTogglePower={togglePowerFilter}
              onReset={resetFilters}
              total={enemies.length}
              shown={filteredEnemies.length}
              noun={{ singular: "ennemi", plural: "ennemis" }}
            />
            {filteredEnemies.map((enemy) => (
              <EnemyCard
                key={enemy.id}
                enemy={enemy}
                onAdd={(e) => addToEncounter(e, "enemy")}
              />
            ))}
            {filteredEnemies.length === 0 && (
              <Card className="py-8">
                <CardContent className="text-center text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Aucun ennemi ne correspond à la recherche</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {view === "npcs" && (
          <div className="space-y-4">
            <CombatantFilters
              search={search}
              onSearchChange={setSearch}
              selectedPowers={powerFilter}
              onTogglePower={togglePowerFilter}
              onReset={resetFilters}
              total={npcs.length}
              shown={filteredNpcs.length}
              noun={{ singular: "PNJ", plural: "PNJ" }}
            />
            {filteredNpcs.map((npc) => (
              <NpcCard
                key={npc.id}
                npc={npc}
                onAdd={(n) => addToEncounter(n, "npc")}
              />
            ))}
            {filteredNpcs.length === 0 && (
              <Card className="py-8">
                <CardContent className="text-center text-muted-foreground">
                  <Search className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Aucun PNJ ne correspond à la recherche</p>
                </CardContent>
              </Card>
            )}
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
