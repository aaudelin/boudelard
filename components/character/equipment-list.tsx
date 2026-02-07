import { Equipment } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Backpack, Coins } from "lucide-react";

interface EquipmentListProps {
  equipment: Equipment;
}

export function EquipmentList({ equipment }: EquipmentListProps) {
  const { currency } = equipment;

  const currencyItems = [
    { key: "platinum", label: "PP", value: currency.platinum },
    { key: "gold", label: "PO", value: currency.gold },
    { key: "electrum", label: "PE", value: currency.electrum },
    { key: "silver", label: "PA", value: currency.silver },
    { key: "copper", label: "PC", value: currency.copper },
  ].filter((c) => c.value > 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Équipement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2">
          <Backpack className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <span className="text-muted-foreground mb-2 block text-sm font-medium">
              Objets
            </span>
            <ul className="space-y-1">
              {equipment.items.map((item, index) => (
                <li key={index} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-2">
          <Coins className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <span className="text-muted-foreground mb-2 block text-sm font-medium">
              Monnaie
            </span>
            {currencyItems.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currencyItems.map((c) => (
                  <Badge key={c.key} variant="outline">
                    {c.value} {c.label}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">Aucune</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
