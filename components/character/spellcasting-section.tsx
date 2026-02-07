import { Spellcasting, Spell } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  formatModifier,
  abilityLabels,
  getSpellLevelLabel,
} from "@/lib/dnd-helpers";
import { Wand2, Target, Shield } from "lucide-react";

interface SpellcastingSectionProps {
  spellcasting: Spellcasting;
}

function SpellCard({ spell }: { spell: Spell }) {
  return (
    <AccordionItem value={spell.name}>
      <AccordionTrigger className="text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium">{spell.name}</span>
          {spell.concentration && (
            <Badge variant="outline" className="text-xs">
              C
            </Badge>
          )}
          {spell.ritual && (
            <Badge variant="outline" className="text-xs">
              R
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 text-sm">
          <div className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1">
            <span>Incantation: {spell.castingTime}</span>
            <span>Portée: {spell.range}</span>
            <span>Composantes: {spell.components}</span>
            <span>Durée: {spell.duration}</span>
          </div>
          <Separator />
          <p className="text-muted-foreground">{spell.description}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function SpellcastingSection({ spellcasting }: SpellcastingSectionProps) {
  const abilityName =
    abilityLabels[spellcasting.spellcastingAbility] ||
    spellcasting.spellcastingAbility;

  const groupedSpells: Record<number, Spell[]> = {};

  spellcasting.cantripsKnown.forEach((spell) => {
    if (!groupedSpells[0]) groupedSpells[0] = [];
    groupedSpells[0].push(spell);
  });

  spellcasting.spellsKnown.forEach((spell) => {
    if (!groupedSpells[spell.level]) groupedSpells[spell.level] = [];
    groupedSpells[spell.level].push(spell);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wand2 className="h-5 w-5" />
          Incantation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border p-2">
            <div className="text-muted-foreground text-xs">Caractéristique</div>
            <div className="font-semibold">{abilityName}</div>
          </div>
          <div className="rounded-lg border p-2">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              DD
            </div>
            <div className="font-semibold">{spellcasting.spellSaveDC}</div>
          </div>
          <div className="rounded-lg border p-2">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Target className="h-3 w-3" />
              Attaque
            </div>
            <div className="font-semibold">
              {formatModifier(spellcasting.spellAttackBonus)}
            </div>
          </div>
        </div>

        {spellcasting.spellSlots.length > 0 && (
          <div>
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Emplacements de sorts
            </h4>
            <div className="flex flex-wrap gap-2">
              {spellcasting.spellSlots.map((slot) => (
                <Badge key={slot.level} variant="secondary">
                  Niv. {slot.level}: {slot.total - slot.expended}/{slot.total}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {Object.entries(groupedSpells)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([level, spells]) => (
            <div key={level}>
              <h4 className="mb-2 font-medium">
                {getSpellLevelLabel(Number(level))}
              </h4>
              <Accordion type="multiple" className="w-full">
                {spells.map((spell) => (
                  <SpellCard key={spell.name} spell={spell} />
                ))}
              </Accordion>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}
