import { Proficiencies as ProficienciesType } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Sword, Wrench, Languages } from "lucide-react";

interface ProficienciesProps {
  proficiencies: ProficienciesType;
}

export function Proficiencies({ proficiencies }: ProficienciesProps) {
  const sections = [
    { icon: Shield, label: "Armures", items: proficiencies.armor },
    { icon: Sword, label: "Armes", items: proficiencies.weapons },
    { icon: Wrench, label: "Outils", items: proficiencies.tools },
    { icon: Languages, label: "Langues", items: proficiencies.languages },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Maîtrises et langues</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.label}>
            {index > 0 && <Separator className="mb-4" />}
            <div className="flex items-start gap-2">
              <section.icon className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                <span className="text-muted-foreground mb-1 block text-sm font-medium">
                  {section.label}
                </span>
                {section.items.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {section.items.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Aucune</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
