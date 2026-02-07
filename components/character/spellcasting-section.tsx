"use client";

import { useState } from "react";
import { Spellcasting, Spell, SpellSlot } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formatModifier,
  abilityLabels,
  getSpellLevelLabel,
} from "@/lib/dnd-helpers";
import { Wand2, Target, Shield, Minus, Plus } from "lucide-react";

interface SpellcastingSectionProps {
  characterId: string;
  spellcasting: Spellcasting;
  onSlotsChange?: (slots: SpellSlot[]) => void;
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

interface SpellSlotEditorProps {
  characterId: string;
  slot: SpellSlot;
  onUpdate: (level: number, expended: number) => void;
}

function SpellSlotEditor({ characterId, slot, onUpdate }: SpellSlotEditorProps) {
  const remaining = slot.total - slot.expended;

  const useSlot = async () => {
    if (remaining > 0) {
      const newExpended = slot.expended + 1;
      onUpdate(slot.level, newExpended);

      await fetch(`/api/characters/${characterId}/stats`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spellSlots: [{ level: slot.level, expended: newExpended }],
        }),
      });
    }
  };

  const recoverSlot = async () => {
    if (slot.expended > 0) {
      const newExpended = slot.expended - 1;
      onUpdate(slot.level, newExpended);

      await fetch(`/api/characters/${characterId}/stats`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spellSlots: [{ level: slot.level, expended: newExpended }],
        }),
      });
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border p-2">
      <span className="text-xs text-muted-foreground min-w-[3rem]">
        Niv. {slot.level}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={useSlot}
        disabled={remaining <= 0}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="font-mono text-sm font-semibold min-w-[2.5rem] text-center">
        {remaining}/{slot.total}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={recoverSlot}
        disabled={slot.expended <= 0}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

export function SpellcastingSection({
  characterId,
  spellcasting,
  onSlotsChange,
}: SpellcastingSectionProps) {
  const [spellSlots, setSpellSlots] = useState(spellcasting.spellSlots);

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

  const handleSlotUpdate = (level: number, expended: number) => {
    const newSlots = spellSlots.map((s) =>
      s.level === level ? { ...s, expended } : s
    );
    setSpellSlots(newSlots);
    onSlotsChange?.(newSlots);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wand2 className="h-5 w-5" />
          Incantation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap justify-center gap-2 text-center">
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

        {spellSlots.length > 0 && (
          <div>
            <h4 className="text-muted-foreground mb-2 text-sm font-medium">
              Emplacements de sorts
            </h4>
            <div className="flex flex-wrap gap-2">
              {spellSlots.map((slot) => (
                <SpellSlotEditor
                  key={slot.level}
                  characterId={characterId}
                  slot={slot}
                  onUpdate={handleSlotUpdate}
                />
              ))}
            </div>
          </div>
        )}

        <Separator />

        {Object.entries(groupedSpells)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([level, spells]) => (
            <div key={level} className="space-y-2">
              <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-muted/80 backdrop-blur-sm border-l-4 border-primary">
                <h4 className="font-semibold text-sm tracking-wide">
                  {getSpellLevelLabel(Number(level))}
                </h4>
              </div>
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
