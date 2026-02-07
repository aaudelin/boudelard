import { Attack } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatModifier } from "@/lib/dnd-helpers";
import { Swords } from "lucide-react";

interface AttacksSectionProps {
  attacks: Attack[];
}

export function AttacksSection({ attacks }: AttacksSectionProps) {
  if (attacks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Swords className="h-5 w-5" />
          Attaques
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {attacks.map((attack, index) => (
          <div
            key={index}
            className="rounded-lg border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{attack.name}</span>
              <Badge variant="default">
                {formatModifier(attack.attackBonus)} att.
              </Badge>
            </div>
            <div className="text-muted-foreground mt-1 text-sm">
              <span className="font-medium text-foreground">
                {attack.damage}
              </span>{" "}
              {attack.damageType}
            </div>
            {attack.range && (
              <div className="text-muted-foreground mt-1 text-xs">
                Portée: {attack.range}
              </div>
            )}
            {attack.properties && attack.properties.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {attack.properties.map((prop) => (
                  <Badge key={prop} variant="outline" className="text-xs">
                    {prop}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
