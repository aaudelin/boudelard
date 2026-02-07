"use client";

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { HitPoints, SpellSlot } from "@/types/character";

interface CharacterEditableState {
  hitPoints: HitPoints;
  gold: number;
  silver: number;
  spellSlots: SpellSlot[];
  onHitPointsChange: (hitPoints: HitPoints) => void;
  onMoneyChange: (gold: number, silver: number) => void;
  onSpellSlotsChange: (slots: SpellSlot[]) => void;
}

interface CharacterStateWrapperProps {
  characterId: string;
  initialHitPoints: HitPoints;
  initialGold: number;
  initialSilver: number;
  initialSpellSlots: SpellSlot[];
  children: (state: CharacterEditableState) => ReactNode;
}

interface PendingChanges {
  hitPoints?: { current: number };
  money?: { gold: number; silver: number };
  spellSlots?: { level: number; expended: number }[];
}

const SAVE_INTERVAL_MS = 2000;

export function CharacterStateWrapper({
  characterId,
  initialHitPoints,
  initialGold,
  initialSilver,
  initialSpellSlots,
  children,
}: CharacterStateWrapperProps) {
  const [hitPoints, setHitPoints] = useState<HitPoints>(initialHitPoints);
  const [gold, setGold] = useState(initialGold);
  const [silver, setSilver] = useState(initialSilver);
  const [spellSlots, setSpellSlots] = useState<SpellSlot[]>(initialSpellSlots);
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});

  const characterIdRef = useRef(characterId);
  const pendingChangesRef = useRef<PendingChanges>({});

  // Keep refs in sync with state
  useEffect(() => {
    characterIdRef.current = characterId;
  }, [characterId]);

  useEffect(() => {
    pendingChangesRef.current = pendingChanges;
  }, [pendingChanges]);

  // Set up interval for periodic saves
  useEffect(() => {
    const saveChanges = async () => {
      const changes = pendingChangesRef.current;
      if (Object.keys(changes).length === 0) return;

      // Clear pending changes immediately
      setPendingChanges({});
      pendingChangesRef.current = {};

      try {
        await fetch(`/api/characters/${characterIdRef.current}/stats`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changes),
        });
      } catch (error) {
        console.error("Failed to save character state:", error);
      }
    };

    const intervalId = setInterval(saveChanges, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      // Flush pending changes on unmount
      const changes = pendingChangesRef.current;
      if (Object.keys(changes).length > 0) {
        fetch(`/api/characters/${characterIdRef.current}/stats`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changes),
        }).catch((error) => {
          console.error("Failed to save character state on unmount:", error);
        });
      }
    };
  }, []);

  const handleHitPointsChange = useCallback((newHitPoints: HitPoints) => {
    setHitPoints(newHitPoints);
    setPendingChanges((prev) => ({
      ...prev,
      hitPoints: { current: newHitPoints.current },
    }));
  }, []);

  const handleMoneyChange = useCallback((newGold: number, newSilver: number) => {
    setGold(newGold);
    setSilver(newSilver);
    setPendingChanges((prev) => ({
      ...prev,
      money: { gold: newGold, silver: newSilver },
    }));
  }, []);

  const handleSpellSlotsChange = useCallback((newSlots: SpellSlot[]) => {
    setSpellSlots(newSlots);
    setPendingChanges((prev) => ({
      ...prev,
      spellSlots: newSlots.map((slot) => ({
        level: slot.level,
        expended: slot.expended,
      })),
    }));
  }, []);

  const state: CharacterEditableState = {
    hitPoints,
    gold,
    silver,
    spellSlots,
    onHitPointsChange: handleHitPointsChange,
    onMoneyChange: handleMoneyChange,
    onSpellSlotsChange: handleSpellSlotsChange,
  };

  return <>{children(state)}</>;
}
