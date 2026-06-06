"use client";

import { Feature, FeatureUseState } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Minus, Plus } from "lucide-react";

interface FeaturesTraitsProps {
  features: Feature[];
  featureUses: FeatureUseState[];
  onFeatureUsesChange: (uses: FeatureUseState[]) => void;
}

function getUsesKey(feature: Feature): string {
  return feature.uses?.key ?? feature.name;
}

export function FeaturesTraits({
  features,
  featureUses,
  onFeatureUsesChange,
}: FeaturesTraitsProps) {
  if (features.length === 0) {
    return null;
  }

  const handleUseUpdate = (key: string, expended: number) => {
    const newUses = featureUses.map((use) =>
      use.key === key ? { ...use, expended } : use
    );
    onFeatureUsesChange(newUses);
  };

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
          {features.map((feature, index) => {
            const usesKey = getUsesKey(feature);
            const use = feature.uses
              ? featureUses.find((u) => u.key === usesKey)
              : undefined;
            const expended = use?.expended ?? feature.uses?.expended ?? 0;
            const maximum = feature.uses?.maximum ?? 0;
            const remaining = maximum - expended;

            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <AccordionTrigger className="text-left">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">{feature.name}</span>
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {feature.source}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                  </div>
                  {feature.uses && (
                    <div className="flex shrink-0 flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            if (remaining > 0) {
                              handleUseUpdate(usesKey, expended + 1);
                            }
                          }}
                          disabled={remaining <= 0}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-mono text-sm font-semibold min-w-10 text-center">
                          {remaining}/{maximum}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            if (expended > 0) {
                              handleUseUpdate(usesKey, expended - 1);
                            }
                          }}
                          disabled={expended <= 0}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {feature.uses.recovery === "short"
                          ? "repos court"
                          : "repos long"}
                      </span>
                    </div>
                  )}
                </div>
                <AccordionContent>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
