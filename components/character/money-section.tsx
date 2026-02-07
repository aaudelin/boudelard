"use client";

import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoneySectionProps {
  gold: number;
  silver: number;
  onMoneyChange: (gold: number, silver: number) => void;
}

export function MoneySection({
  gold,
  silver,
  onMoneyChange,
}: MoneySectionProps) {
  // D&D conversion: 1 PO = 10 PA
  const totalInSilver = gold * 10 + silver;

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

    onMoneyChange(normalizedGold, normalizedSilver);
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
                "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                "bg-slate-50 border-slate-200 dark:bg-slate-950/20 dark:border-slate-700",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
