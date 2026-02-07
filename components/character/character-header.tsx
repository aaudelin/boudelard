import { Character } from "@/types/character";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  classLabels,
  subclassLabels,
  backgroundLabels,
} from "@/lib/dnd-helpers";
import Image from "next/image";

interface CharacterHeaderProps {
  character: Character;
}

export function CharacterHeader({ character }: CharacterHeaderProps) {
  const className = classLabels[character.class] || character.class;
  const subclassName = subclassLabels[character.subclass] || character.subclass;
  const backgroundName =
    backgroundLabels[character.background] || character.background;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {character.image && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={character.image}
                alt={character.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-2xl font-bold">{character.name}</h1>
            <p className="text-muted-foreground">
              {character.race} - {backgroundName}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="default">Niveau {character.level}</Badge>
              <Badge variant="secondary">{className}</Badge>
              <Badge variant="outline">{subclassName}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
