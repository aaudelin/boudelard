"use client";

import { useState } from "react";
import { enemies } from "@/data/enemies";
import { Enemy, EncounterEnemy, PowerLevel } from "@/types/enemy";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const PASSWORD = "liamlebg";

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
          <div className="space-y-3 pt-2 border-t">
            <div>
              <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                <Gauge className="h-3 w-3" />
                Puissance {enemy.powerLevel}
              </h4>
              <p className="text-sm text-muted-foreground ml-4">
                {POWER_LEVELS[enemy.powerLevel].description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                <Swords className="h-3 w-3" />
                Attaques
              </h4>
              {enemy.attacks.map((attack, i) => (
                <div key={i} className="text-sm text-muted-foreground ml-4">
                  <span className="font-medium text-foreground">
                    {attack.name}:
                  </span>{" "}
                  +{attack.bonus}, {attack.damage} {attack.damageType}
                  {attack.range && ` (${attack.range})`}
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                <Zap className="h-3 w-3" />
                Capacités
              </h4>
              {enemy.abilities.map((ability, i) => (
                <div key={i} className="text-sm text-muted-foreground ml-4">
                  <span className="font-medium text-foreground">
                    {ability.name}:
                  </span>{" "}
                  {ability.description}
                </div>
              ))}
            </div>

            {enemy.immunities && enemy.immunities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm font-medium">Immunités:</span>
                {enemy.immunities.map((imm) => (
                  <Badge key={imm} variant="destructive" className="text-xs">
                    {imm}
                  </Badge>
                ))}
              </div>
            )}

            {enemy.resistances && enemy.resistances.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm font-medium">Résistances:</span>
                {enemy.resistances.map((res) => (
                  <Badge key={res} variant="secondary" className="text-xs">
                    {res}
                  </Badge>
                ))}
              </div>
            )}

            {enemy.vulnerabilities && enemy.vulnerabilities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm font-medium">Vulnérabilités:</span>
                {enemy.vulnerabilities.map((vuln) => (
                  <Badge key={vuln} className="text-xs bg-yellow-500">
                    {vuln}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EncounterEnemyCard({
  enemy,
  onHpChange,
  onRemove,
}: {
  enemy: EncounterEnemy;
  onHpChange: (instanceId: string, delta: number) => void;
  onRemove: (instanceId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hpPercent = Math.max(0, (enemy.currentHp / enemy.hp) * 100);
  const isDead = enemy.currentHp <= 0;

  const getHpColor = () => {
    if (isDead) return "bg-zinc-400";
    if (hpPercent > 50) return "bg-green-500";
    if (hpPercent > 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className={cn("py-4", isDead && "opacity-60")}>
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
              {enemy.label || enemy.name}
            </h3>
            {isDead && <Skull className="h-4 w-4 text-muted-foreground" />}
          </div>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onRemove(enemy.instanceId)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">PV</span>
            <span className="font-mono font-medium">
              {enemy.currentHp} / {enemy.hp}
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
              onClick={() => onHpChange(enemy.instanceId, -10)}
            >
              -10
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onHpChange(enemy.instanceId, -5)}
            >
              -5
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onHpChange(enemy.instanceId, -1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onHpChange(enemy.instanceId, 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => onHpChange(enemy.instanceId, 5)}
            >
              +5
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <PowerLevelBadge level={enemy.powerLevel} />
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            CA {enemy.ac}
          </Badge>
          {enemy.speed && <Badge variant="secondary">{enemy.speed}</Badge>}
        </div>

        {expanded && (
          <div className="space-y-3 pt-2 border-t">
            <div>
              <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                <Gauge className="h-3 w-3" />
                Puissance {enemy.powerLevel}
              </h4>
              <p className="text-sm text-muted-foreground ml-4">
                {POWER_LEVELS[enemy.powerLevel].description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                <Swords className="h-3 w-3" />
                Attaques
              </h4>
              {enemy.attacks.map((attack, i) => (
                <div key={i} className="text-sm text-muted-foreground ml-4">
                  <span className="font-medium text-foreground">
                    {attack.name}:
                  </span>{" "}
                  +{attack.bonus}, {attack.damage} {attack.damageType}
                  {attack.range && ` (${attack.range})`}
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                <Zap className="h-3 w-3" />
                Capacités
              </h4>
              {enemy.abilities.map((ability, i) => (
                <div key={i} className="text-sm text-muted-foreground ml-4">
                  <span className="font-medium text-foreground">
                    {ability.name}:
                  </span>{" "}
                  {ability.description}
                </div>
              ))}
            </div>

            {enemy.immunities && enemy.immunities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm font-medium">Immunités:</span>
                {enemy.immunities.map((imm) => (
                  <Badge key={imm} variant="destructive" className="text-xs">
                    {imm}
                  </Badge>
                ))}
              </div>
            )}

            {enemy.resistances && enemy.resistances.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm font-medium">Résistances:</span>
                {enemy.resistances.map((res) => (
                  <Badge key={res} variant="secondary" className="text-xs">
                    {res}
                  </Badge>
                ))}
              </div>
            )}

            {enemy.vulnerabilities && enemy.vulnerabilities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm font-medium">Vulnérabilités:</span>
                {enemy.vulnerabilities.map((vuln) => (
                  <Badge key={vuln} className="text-xs bg-yellow-500">
                    {vuln}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BestiairePage() {
  const [encounter, setEncounter] = useState<EncounterEnemy[]>([]);
  const [view, setView] = useState<"encounter" | "bestiary">("encounter");

  const addToEncounter = (enemy: Enemy) => {
    const sameTypeCount = encounter.filter((e) => e.id === enemy.id).length;
    const newEnemy: EncounterEnemy = {
      ...enemy,
      instanceId: `${enemy.id}-${Date.now()}`,
      currentHp: enemy.hp,
      label: sameTypeCount > 0 ? `${enemy.name} ${sameTypeCount + 1}` : undefined,
    };

    // Update labels for existing enemies of the same type
    if (sameTypeCount === 0) {
      setEncounter([...encounter, newEnemy]);
    } else {
      const updated = encounter.map((e) => {
        if (e.id === enemy.id && !e.label) {
          return { ...e, label: `${e.name} 1` };
        }
        return e;
      });
      setEncounter([...updated, { ...newEnemy, label: `${enemy.name} ${sameTypeCount + 1}` }]);
    }
  };

  const updateHp = (instanceId: string, delta: number) => {
    setEncounter(
      encounter.map((e) =>
        e.instanceId === instanceId
          ? { ...e, currentHp: Math.max(0, Math.min(e.hp, e.currentHp + delta)) }
          : e
      )
    );
  };

  const removeFromEncounter = (instanceId: string) => {
    setEncounter(encounter.filter((e) => e.instanceId !== instanceId));
  };

  const clearEncounter = () => {
    setEncounter([]);
  };

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
          </div>
        </header>

        {view === "encounter" && (
          <div className="space-y-4">
            {encounter.length === 0 ? (
              <Card className="py-8">
                <CardContent className="text-center text-muted-foreground">
                  <Swords className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Aucun ennemi dans la rencontre</p>
                  <p className="text-sm mt-1">
                    Allez dans le Bestiaire pour ajouter des ennemis
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
                {encounter.map((enemy) => (
                  <EncounterEnemyCard
                    key={enemy.instanceId}
                    enemy={enemy}
                    onHpChange={updateHp}
                    onRemove={removeFromEncounter}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {view === "bestiary" && (
          <div className="space-y-4">
            {enemies.map((enemy) => (
              <EnemyCard key={enemy.id} enemy={enemy} onAdd={addToEncounter} />
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
