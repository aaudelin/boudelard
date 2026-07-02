import { notFound } from "next/navigation";
import { getCharacterBySlug } from "@/lib/characters";
import { PlayerMapPanel } from "@/components/map/player-map-panel";
import { MapToggleFab } from "@/components/map/map-toggle-fab";

// Toujours rendre dynamiquement : la carte vient de Redis
export const dynamic = "force-dynamic";

interface CharacterMapPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: CharacterMapPageProps) {
  const { name } = await params;
  const character = await getCharacterBySlug(name);

  if (!character) {
    return { title: "Personnage non trouvé" };
  }

  return {
    title: `${character.name} - Carte`,
    description: `Carte de la rencontre pour ${character.name}`,
  };
}

export default async function CharacterMapPage({
  params,
}: CharacterMapPageProps) {
  const { name } = await params;
  const character = await getCharacterBySlug(name);

  if (!character) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="space-y-4 pb-20">
          <header>
            <h1 className="text-2xl font-bold tracking-tight">
              {character.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Carte de la rencontre
            </p>
          </header>

          <PlayerMapPanel characterId={character.id} />
        </div>
      </div>

      <MapToggleFab href={`/character/${name}`} target="sheet" />
    </div>
  );
}
