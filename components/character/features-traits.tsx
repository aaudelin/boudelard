import { Feature } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface FeaturesTraitsProps {
  features: Feature[];
}

export function FeaturesTraits({ features }: FeaturesTraitsProps) {
  if (features.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5" />
          Capacités et traits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {features.map((feature, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                <div className="flex flex-col items-start gap-1">
                  <span className="font-medium">{feature.name}</span>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {feature.source}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
