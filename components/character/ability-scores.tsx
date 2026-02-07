import { Abilities } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatModifier, abilityAbbreviations } from "@/lib/dnd-helpers";

interface AbilityScoresProps {
  abilities: Abilities;
}

export function AbilityScores({ abilities }: AbilityScoresProps) {
  const abilityKeys = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Caractéristiques</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {abilityKeys.map((key) => {
            const ability = abilities[key];
            return (
              <div
                key={key}
                className="flex flex-col items-center rounded-lg border p-2"
              >
                <span className="text-muted-foreground text-xs font-medium">
                  {abilityAbbreviations[key]}
                </span>
                <span className="text-xl font-bold">
                  {formatModifier(ability.modifier)}
                </span>
                <span className="bg-muted text-muted-foreground rounded px-2 text-sm">
                  {ability.value}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
