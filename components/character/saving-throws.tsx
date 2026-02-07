import { SavingThrows as SavingThrowsType } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatModifier, abilityLabels } from "@/lib/dnd-helpers";
import { cn } from "@/lib/utils";
import { Circle, CircleCheck } from "lucide-react";

interface SavingThrowsProps {
  savingThrows: SavingThrowsType;
}

export function SavingThrows({ savingThrows }: SavingThrowsProps) {
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
        <CardTitle className="text-lg">Jets de sauvegarde</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {abilityKeys.map((key) => {
            const save = savingThrows[key];
            return (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-between rounded-md border px-3 py-2",
                  save.proficient && "bg-primary/5 border-primary/20"
                )}
              >
                <div className="flex items-center gap-2">
                  {save.proficient ? (
                    <CircleCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="text-muted-foreground h-4 w-4" />
                  )}
                  <span className="text-sm">{abilityLabels[key]}</span>
                </div>
                <span
                  className={cn(
                    "font-mono font-semibold",
                    save.proficient && "text-primary"
                  )}
                >
                  {formatModifier(save.modifier)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
