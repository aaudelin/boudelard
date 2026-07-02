import Link from "next/link";
import { Map as MapIcon, ScrollText } from "lucide-react";

// Bouton flottant pour basculer entre la fiche de personnage et la
// carte (mobile first : accessible au pouce en bas de l'écran)
export function MapToggleFab({
  href,
  target,
}: {
  href: string;
  target: "map" | "sheet";
}) {
  return (
    <Link
      href={href}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-transform active:scale-95"
    >
      {target === "map" ? (
        <>
          <MapIcon className="h-4 w-4" />
          Carte
        </>
      ) : (
        <>
          <ScrollText className="h-4 w-4" />
          Fiche
        </>
      )}
    </Link>
  );
}
