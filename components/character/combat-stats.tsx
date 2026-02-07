"use client";

import { HitPoints } from "@/types/character";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatModifier } from "@/lib/dnd-helpers";
import { Shield, Eye, Zap, Footprints, Minus, Plus } from "lucide-react";

interface CombatStatsProps {
  armorClass: number;
  passivePerception: number;
  initiative: number;
  speed: number;
  hitPoints: HitPoints;
  proficiencyBonus: number;
  onHitPointsChange: (hitPoints: HitPoints) => void;
}

export function CombatStats({
  armorClass,
  passivePerception,
  initiative,
  speed,
  hitPoints,
  proficiencyBonus,
  onHitPointsChange,
}: CombatStatsProps) {
  const hpPercentage = (hitPoints.current / hitPoints.maximum) * 100;

  const updateHP = (newCurrent: number) => {
    const clampedHP = Math.max(0, Math.min(newCurrent, hitPoints.maximum));
    onHitPointsChange({ ...hitPoints, current: clampedHP });
  };

  const getHPColor = () => {
    if (hpPercentage <= 25) return "bg-red-500";
    if (hpPercentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center">
            <Shield className="text-muted-foreground mb-1 h-5 w-5" />
            <span className="text-muted-foreground text-xs">CA</span>
            <span className="text-2xl font-bold">{armorClass}</span>
          </div>
          <div className="flex flex-col items-center">
            <Eye className="mb-1 h-5 w-5 text-purple-500" />
            <span className="text-muted-foreground text-xs">Percep.</span>
            <span className="text-2xl font-bold">{passivePerception}</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="mb-1 h-5 w-5 text-yellow-500" />
            <span className="text-muted-foreground text-xs">Init</span>
            <span className="text-2xl font-bold">
              {formatModifier(initiative)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Footprints className="text-muted-foreground mb-1 h-5 w-5" />
            <span className="text-muted-foreground text-xs">Vitesse</span>
            <span className="text-2xl font-bold">{speed}m</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Points de vie</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateHP(hitPoints.current - 1)}
                disabled={hitPoints.current <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[4rem] text-center font-mono text-sm font-semibold">
                {hitPoints.current} / {hitPoints.maximum}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateHP(hitPoints.current + 1)}
                disabled={hitPoints.current >= hitPoints.maximum}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress
            value={hpPercentage}
            className="h-3"
            indicatorClassName={getHPColor()}
          />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>Dés de vie: {hitPoints.hitDice}</span>
            <span>
              {`Bonus de maîtrise: +${proficiencyBonus}`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
