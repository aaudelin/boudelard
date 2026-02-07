import { Skills as SkillsType } from "@/types/character";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatModifier,
  skillLabels,
  skillAbilities,
  abilityAbbreviations,
} from "@/lib/dnd-helpers";
import { cn } from "@/lib/utils";
import { Circle, CircleCheck, Star } from "lucide-react";

interface SkillsListProps {
  skills: SkillsType;
}

export function SkillsList({ skills }: SkillsListProps) {
  const skillKeys = [
    "acrobatics",
    "animalHandling",
    "arcana",
    "athletics",
    "deception",
    "history",
    "insight",
    "intimidation",
    "investigation",
    "medicine",
    "nature",
    "perception",
    "performance",
    "persuasion",
    "religion",
    "sleightOfHand",
    "stealth",
    "survival",
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Compétences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {skillKeys.map((key) => {
            const skill = skills[key];
            const abilityKey = skillAbilities[key];
            return (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-between rounded px-2 py-1.5",
                  skill.proficient && "bg-primary/5"
                )}
              >
                <div className="flex items-center gap-2">
                  {skill.expertise ? (
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  ) : skill.proficient ? (
                    <CircleCheck className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Circle className="text-muted-foreground h-3.5 w-3.5" />
                  )}
                  <span className="text-sm">{skillLabels[key]}</span>
                  <span className="text-muted-foreground text-xs">
                    ({abilityAbbreviations[abilityKey]})
                  </span>
                </div>
                <span
                  className={cn(
                    "font-mono text-sm font-semibold",
                    skill.proficient && "text-primary"
                  )}
                >
                  {formatModifier(skill.modifier)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
