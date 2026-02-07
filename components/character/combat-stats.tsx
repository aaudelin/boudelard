import { Character } from "@/types/character";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatModifier } from "@/lib/dnd-helpers";
import { Shield, Heart, Zap, Footprints } from "lucide-react";

interface CombatStatsProps {
  character: Character;
}

export function CombatStats({ character }: CombatStatsProps) {
  const hpPercentage =
    (character.hitPoints.current / character.hitPoints.maximum) * 100;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center">
            <Shield className="text-muted-foreground mb-1 h-5 w-5" />
            <span className="text-muted-foreground text-xs">CA</span>
            <span className="text-2xl font-bold">{character.armorClass}</span>
          </div>
          <div className="flex flex-col items-center">
            <Heart className="mb-1 h-5 w-5 text-red-500" />
            <span className="text-muted-foreground text-xs">PV</span>
            <span className="text-2xl font-bold">
              {character.hitPoints.current}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="mb-1 h-5 w-5 text-yellow-500" />
            <span className="text-muted-foreground text-xs">Init</span>
            <span className="text-2xl font-bold">
              {formatModifier(character.initiative)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Footprints className="text-muted-foreground mb-1 h-5 w-5" />
            <span className="text-muted-foreground text-xs">Vitesse</span>
            <span className="text-2xl font-bold">{character.speed}m</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span>Points de vie</span>
            <span>
              {character.hitPoints.current} / {character.hitPoints.maximum}
            </span>
          </div>
          <Progress value={hpPercentage} className="h-3" />
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
            <span>Dés de vie: {character.hitPoints.hitDice}</span>
            <span>Bonus de maîtrise: +{character.proficiencyBonus}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
