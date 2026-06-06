"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { HitPoints, SpellSlot, FeatureUseState } from "@/types/character";

export interface CharacterEditableState {
  hitPoints: HitPoints;
  gold: number;
  silver: number;
  spellSlots: SpellSlot[];
  featureUses: FeatureUseState[];
  onHitPointsChange: (hitPoints: HitPoints) => void;
  onMoneyChange: (gold: number, silver: number) => void;
  onSpellSlotsChange: (slots: SpellSlot[]) => void;
  onFeatureUsesChange: (uses: FeatureUseState[]) => void;
  flushPendingChanges: () => Promise<void>;
}

const CharacterStateContext = createContext<CharacterEditableState | null>(
  null
);

export function useCharacterState() {
  const context = useContext(CharacterStateContext);
  if (!context) {
    throw new Error(
      "useCharacterState must be used within a CharacterStateWrapper"
    );
  }
  return context;
}

interface CharacterStateWrapperProps {
  characterId: string;
  initialHitPoints: HitPoints;
  initialGold: number;
  initialSilver: number;
  initialSpellSlots: SpellSlot[];
  initialFeatureUses: FeatureUseState[];
  children: ReactNode;
}

interface PendingChanges {
  hitPoints?: { current: number };
  money?: { gold: number; silver: number };
  spellSlots?: { level: number; expended: number }[];
  featureUses?: FeatureUseState[];
}

const SAVE_INTERVAL_MS = 10000;

export function CharacterStateWrapper({
  characterId,
  initialHitPoints,
  initialGold,
  initialSilver,
  initialSpellSlots,
  initialFeatureUses,
  children,
}: CharacterStateWrapperProps) {
  const [hitPoints, setHitPoints] = useState<HitPoints>(initialHitPoints);
  const [gold, setGold] = useState(initialGold);
  const [silver, setSilver] = useState(initialSilver);
  const [spellSlots, setSpellSlots] = useState<SpellSlot[]>(initialSpellSlots);
  const [featureUses, setFeatureUses] =
    useState<FeatureUseState[]>(initialFeatureUses);
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

  // Send pending changes to the server (used by the periodic save, the
  // unmount flush, and before applying a rest)
  const flushPendingChanges = useCallback(async () => {
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
  }, []);

  // Set up interval for periodic saves
  useEffect(() => {
    const intervalId = setInterval(flushPendingChanges, SAVE_INTERVAL_MS);

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
  }, [flushPendingChanges]);

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

  const handleFeatureUsesChange = useCallback((newUses: FeatureUseState[]) => {
    setFeatureUses(newUses);
    setPendingChanges((prev) => ({
      ...prev,
      featureUses: newUses.map((use) => ({
        key: use.key,
        expended: use.expended,
      })),
    }));
  }, []);

  const state: CharacterEditableState = {
    hitPoints,
    gold,
    silver,
    spellSlots,
    featureUses,
    onHitPointsChange: handleHitPointsChange,
    onMoneyChange: handleMoneyChange,
    onSpellSlotsChange: handleSpellSlotsChange,
    onFeatureUsesChange: handleFeatureUsesChange,
    flushPendingChanges,
  };

  return (
    <CharacterStateContext.Provider value={state}>
      {children}
    </CharacterStateContext.Provider>
  );
}
