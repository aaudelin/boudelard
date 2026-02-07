"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebouncedUpdate } from "@/hooks/use-debounced-update";

interface MoneySectionProps {
  characterId: string;
  initialGold: number;
  initialSilver: number;
}

export function MoneySection({
  characterId,
  initialGold,
  initialSilver,
}: MoneySectionProps) {
  const [gold, setGold] = useState(initialGold);
  const [silver, setSilver] = useState(initialSilver);

  // Sync local state when props change (e.g., accordion reopen)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Intentional prop sync pattern
    setGold(initialGold);
    setSilver(initialSilver);
  }, [initialGold, initialSilver]);

  // D&D conversion: 1 PO = 10 PA
  const totalInSilver = gold * 10 + silver;

  const saveMoney = useCallback(
    async (values: { gold: number; silver: number }) => {
      try {
        await fetch(`/api/characters/${characterId}/money`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      } catch (error) {
        console.error("Failed to save money:", error);
      }
    },
    [characterId]
  );

  const debouncedSaveMoney = useDebouncedUpdate(saveMoney);

  const updateMoney = (newGold: number, newSilver: number) => {
    // Normalize: convert excess silver to gold
    let normalizedGold = newGold;
    let normalizedSilver = newSilver;

    if (normalizedSilver >= 10) {
      normalizedGold += Math.floor(normalizedSilver / 10);
      normalizedSilver = normalizedSilver % 10;
    }

    // Handle negative silver by borrowing from gold
    while (normalizedSilver < 0 && normalizedGold > 0) {
      normalizedGold -= 1;
      normalizedSilver += 10;
    }

    // Prevent negative values
    if (normalizedGold < 0) normalizedGold = 0;
    if (normalizedSilver < 0) normalizedSilver = 0;

    // Optimistic UI update
    setGold(normalizedGold);
    setSilver(normalizedSilver);

    // Debounced API call
    debouncedSaveMoney({ gold: normalizedGold, silver: normalizedSilver });
  };

  const handleGoldChange = (value: string) => {
    const newGold = parseInt(value) || 0;
    updateMoney(newGold, silver);
  };

  const handleSilverChange = (value: string) => {
    const newSilver = parseInt(value) || 0;
    updateMoney(gold, newSilver);
  };

  const adjustGold = (delta: number) => {
    updateMoney(gold + delta, silver);
  };

  const adjustSilver = (delta: number) => {
    updateMoney(gold, silver + delta);
  };

  return (
    <div>
      <div className="flex gap-4">
        {/* Gold (PO) */}
        <div className="flex-1">
          <div className="mb-1 text-center text-xs font-medium text-muted-foreground">
            PO (Or)
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => adjustGold(-1)}
              disabled={gold <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="0"
              value={gold}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleGoldChange(e.target.value)}
              className={cn(
                "h-10 text-center font-semibold text-lg",
                "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
              )}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => adjustGold(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Silver (PA) */}
        <div className="flex-1">
          <div className="mb-1 text-center text-xs font-medium text-muted-foreground">
            PA (Argent)
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => adjustSilver(-1)}
              disabled={silver <= 0 && gold <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="0"
              value={silver}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSilverChange(e.target.value)}
              className={cn(
                "h-10 text-center font-semibold text-lg",
                "bg-slate-50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-700"
              )}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => adjustSilver(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-muted-foreground">
        Total: {totalInSilver} PA
      </div>
    </div>
  );
}
