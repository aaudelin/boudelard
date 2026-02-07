import Link from "next/link";
import Image from "next/image";
import { getAllCharacters } from "@/lib/characters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { classLabels, subclassLabels } from "@/lib/dnd-helpers";
import { ChevronRight } from "lucide-react";

export default async function Home() {
  const characters = await getAllCharacters();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-lg px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Boudelard</h1>
          <p className="text-muted-foreground mt-2">
            Fiches de personnages D&D 5e
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {characters.map((character) => {
            const className = classLabels[character.class] || character.class;
            const subclassName =
              subclassLabels[character.subclass] || character.subclass;

            return (
              <Link key={character.id} href={`/character/${character.id}`}>
                <Card className="transition-colors hover:bg-accent/50">
                  <CardContent className="flex items-center gap-4 py-4">
                    {character.image && (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={character.image}
                          alt={character.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-semibold">
                        {character.name}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {character.race}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Badge variant="default" className="text-xs">
                          Niv. {character.level}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {className}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {subclassName}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground h-5 w-5 shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <footer className="mt-8 text-center">
        </footer>
      </div>
    </div>
  );
}
