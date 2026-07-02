import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Lock, Swords, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-lg px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Boudelard</h1>
          <p className="text-muted-foreground mt-2">
            Fiches de personnages D&D 5e
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <Link href="/personnages">
            <Card className="transition-colors hover:bg-accent/50">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Users className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">Espace joueurs</h2>
                  <p className="text-muted-foreground text-sm">
                    Accédez à vos fiches de personnage et à la carte
                  </p>
                </div>
                <ChevronRight className="text-muted-foreground h-5 w-5 shrink-0" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/bestiaire">
            <Card className="transition-colors hover:bg-accent/50">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  <Swords className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="flex items-center gap-1.5 text-lg font-semibold">
                    Espace MJ
                    <Lock className="text-muted-foreground h-4 w-4" />
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Bestiaire, rencontres et carte — protégé par mot de passe
                  </p>
                </div>
                <ChevronRight className="text-muted-foreground h-5 w-5 shrink-0" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
