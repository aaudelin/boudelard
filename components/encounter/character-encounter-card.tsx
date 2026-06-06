"use client";

import { useState } from "react";
import Link from "next/link";
import { Character, Spell } from "@/types/character";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AbilityScores } from "@/components/character/ability-scores";
import { SkillsList } from "@/components/character/skills-list";
import { AttacksSection } from "@/components/character/attacks-section";
import {
  formatModifier,
  classLabels,
  getSpellLevelLabel,
} from "@/lib/dnd-helpers";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

function SpellGroup({ title, spells }: { title: string; spells: Spell[] }) {
  if (spells.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
      {spells.map((spell, i) => (
        <div key={i} className="text-sm text-muted-foreground ml-4">
          <span className="font-medium text-foreground">{spell.name}</span>
          {spell.concentration && " (concentration)"}
          {spell.ritual && " (rituel)"}
        </div>
      ))}
    </div>
  );
}

// Fiche de consultation rapide pour la rencontre : lecture seule
// (pas de PV ni d'emplacements de sorts), seule l'initiative est éditable
export function CharacterEncounterCard({
  character,
  initiative,
  onInitiativeChange,
}: {
  character: Character;
  initiative: number | undefined;
  onInitiativeChange: (id: string, value: number | undefined) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const className = classLabels[character.class] || character.class;

  const spellLevels = character.spellcasting
    ? [...new Set(character.spellcasting.spellsKnown.map((s) => s.level))].sort(
        (a, b) => a - b
      )
    : [];

  return (
    <Card className="py-4 border-l-4 border-l-emerald-500">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-accent rounded"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <h3 className="font-semibold">{character.name}</h3>
          </div>
          <Link
            href={`/character/${character.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Fiche
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          {character.race} — {className} niveau {character.level}
        </p>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Initiative</label>
          <Input
            type="number"
            className="w-16 h-8 text-center font-mono"
            value={initiative ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              onInitiativeChange(
                character.id,
                raw === "" ? undefined : Number(raw)
              );
            }}
          />
          <span className="text-xs text-muted-foreground">
            (mod. {formatModifier(character.initiative)})
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            CA {character.armorClass}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Eye className="h-3 w-3" />
            Perception passive {character.passivePerception}
          </Badge>
          <Badge variant="secondary">{character.speed}m</Badge>
        </div>

        {expanded && (
          <div className="space-y-3 pt-2 border-t">
            <AbilityScores abilities={character.abilities} />
            <SkillsList skills={character.skills} />
            <AttacksSection attacks={character.attacks} />

            {character.featuresAndTraits.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                  <Zap className="h-3 w-3" />
                  Capacités
                </h4>
                {character.featuresAndTraits.map((feature, i) => (
                  <div key={i} className="text-sm text-muted-foreground ml-4">
                    <span className="font-medium text-foreground">
                      {feature.name}:
                    </span>{" "}
                    {feature.description}
                  </div>
                ))}
              </div>
            )}

            {character.spellcasting && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Sorts
                  <span className="text-xs text-muted-foreground font-normal">
                    (DD {character.spellcasting.spellSaveDC}, att.{" "}
                    {formatModifier(character.spellcasting.spellAttackBonus)})
                  </span>
                </h4>
                <SpellGroup
                  title={getSpellLevelLabel(0)}
                  spells={character.spellcasting.cantripsKnown}
                />
                {spellLevels.map((level) => (
                  <SpellGroup
                    key={level}
                    title={getSpellLevelLabel(level)}
                    spells={character.spellcasting!.spellsKnown.filter(
                      (s) => s.level === level
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
