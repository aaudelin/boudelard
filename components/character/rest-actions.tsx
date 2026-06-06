"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useCharacterState } from "./character-state-wrapper";

interface RestActionsProps {
  characterId: string;
  characterClass: string;
}

export function RestActions({ characterId, characterClass }: RestActionsProps) {
  const [isResting, setIsResting] = useState<"short" | "long" | null>(null);
  const { flushPendingChanges } = useCharacterState();

  const handleRest = async (type: "short" | "long") => {
    setIsResting(type);
    try {
      // Save unsaved edits (HP, feature uses, spell slots, money) first so
      // the rest applies on top of them instead of a stale Redis state
      await flushPendingChanges();

      const response = await fetch(`/api/characters/${characterId}/rest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        // Hard refresh to get updated data
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to rest:", error);
      setIsResting(null);
    }
  };

  const getShortRestDescription = () => {
    if (characterClass === "warlock") {
      return "Récupère les emplacements de sorts";
    }
    return "Repos d'1 heure minimum";
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleRest("short")}
        disabled={isResting !== null}
        className="flex-1"
        title={getShortRestDescription()}
      >
        <Sun className="mr-2 h-4 w-4" />
        {isResting === "short" ? "..." : "RC"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleRest("long")}
        disabled={isResting !== null}
        className="flex-1"
        title="Récupère tous les PV et emplacements de sorts"
      >
        <Moon className="mr-2 h-4 w-4" />
        {isResting === "long" ? "..." : "RL"}
      </Button>
    </div>
  );
}
