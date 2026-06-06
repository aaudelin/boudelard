import { Redis } from "@upstash/redis";
import { Character, Feature, FeatureUseState } from "@/types/character";

const redis = Redis.fromEnv();

// Mutable state stored in Redis (everything else stays in JSON)
export interface CharacterState {
  hitPoints: {
    current: number;
    temporary: number;
    hitDiceRemaining: number;
  };
  spellSlots: { level: number; expended: number }[];
  featureUses: FeatureUseState[];
  money: {
    gold: number;
    silver: number;
  };
}

// Resolve the counter key of a feature (shared pools use the same key)
export function getFeatureUsesKey(feature: Feature): string {
  return feature.uses?.key ?? feature.name;
}

export interface FeatureUsesDefinition {
  key: string;
  maximum: number;
  recovery: "short" | "long";
}

// Collect the limited-use counters defined by a character's features,
// deduplicated by key (shared pools like "Conduit divin")
export function getFeatureUsesDefinitions(
  character: Character
): FeatureUsesDefinition[] {
  const definitions: FeatureUsesDefinition[] = [];
  for (const feature of character.featuresAndTraits) {
    if (!feature.uses) continue;
    const key = getFeatureUsesKey(feature);
    if (!definitions.some((d) => d.key === key)) {
      definitions.push({
        key,
        maximum: feature.uses.maximum,
        recovery: feature.uses.recovery,
      });
    }
  }
  return definitions;
}

function getInitialFeatureUses(character: Character): FeatureUseState[] {
  const uses: FeatureUseState[] = [];
  for (const feature of character.featuresAndTraits) {
    if (!feature.uses) continue;
    const key = getFeatureUsesKey(feature);
    if (!uses.some((u) => u.key === key)) {
      uses.push({ key, expended: feature.uses.expended });
    }
  }
  return uses;
}

function getStateKey(characterId: string): string {
  return `character:${characterId}:state`;
}

export async function getCharacterState(
  characterId: string
): Promise<CharacterState | null> {
  try {
    const state = await redis.get<CharacterState>(getStateKey(characterId));
    return state;
  } catch (error) {
    console.error("Failed to get character state from Redis:", error);
    return null;
  }
}

export async function setCharacterState(
  characterId: string,
  state: CharacterState
): Promise<boolean> {
  try {
    await redis.set(getStateKey(characterId), state);
    return true;
  } catch (error) {
    console.error("Failed to set character state in Redis:", error);
    return false;
  }
}

export async function updateCharacterState(
  characterId: string,
  updates: Partial<CharacterState>
): Promise<CharacterState | null> {
  try {
    const currentState = await getCharacterState(characterId);
    if (!currentState) {
      return null;
    }

    const newState: CharacterState = {
      ...currentState,
      ...updates,
      hitPoints: {
        ...currentState.hitPoints,
        ...(updates.hitPoints || {}),
      },
      money: {
        ...currentState.money,
        ...(updates.money || {}),
      },
      spellSlots: updates.spellSlots || currentState.spellSlots,
      featureUses: updates.featureUses || currentState.featureUses || [],
    };

    await setCharacterState(characterId, newState);
    return newState;
  } catch (error) {
    console.error("Failed to update character state:", error);
    return null;
  }
}

// Reconcile spell slots with character JSON (e.g. after a level up adds
// new slot levels): keep expended counts from state, add missing levels,
// drop levels no longer in the JSON
function reconcileSpellSlots(
  character: Character,
  state: CharacterState
): CharacterState | null {
  const jsonSlots = character.spellcasting?.spellSlots || [];
  const inSync =
    jsonSlots.length === state.spellSlots.length &&
    jsonSlots.every((s) =>
      state.spellSlots.some((slot) => slot.level === s.level)
    );
  if (inSync) {
    return null;
  }

  return {
    ...state,
    spellSlots: jsonSlots.map((s) => {
      const stateSlot = state.spellSlots.find(
        (slot) => slot.level === s.level
      );
      return { level: s.level, expended: stateSlot?.expended ?? s.expended };
    }),
  };
}

// Reconcile feature uses with character JSON (e.g. older states without
// featureUses, or new limited-use features after a level up): keep expended
// counts from state, add missing counters, drop counters no longer in the JSON
function reconcileFeatureUses(
  character: Character,
  state: CharacterState
): CharacterState | null {
  const definitions = getFeatureUsesDefinitions(character);
  const stateUses = state.featureUses || [];
  const inSync =
    definitions.length === stateUses.length &&
    definitions.every((d) => stateUses.some((u) => u.key === d.key));
  if (inSync) {
    return null;
  }

  return {
    ...state,
    featureUses: definitions.map((d) => {
      const stateUse = stateUses.find((u) => u.key === d.key);
      return { key: d.key, expended: stateUse?.expended ?? 0 };
    }),
  };
}

// Initialize state from character JSON if not exists in Redis
export async function initializeCharacterState(
  character: Character
): Promise<CharacterState> {
  const existingState = await getCharacterState(character.id);
  if (existingState) {
    // Self-heal stale states whose spell slot levels or feature use
    // counters no longer match the JSON
    let reconciled = reconcileSpellSlots(character, existingState);
    reconciled =
      reconcileFeatureUses(character, reconciled ?? existingState) ??
      reconciled;
    if (reconciled) {
      await setCharacterState(character.id, reconciled);
      return reconciled;
    }
    return existingState;
  }

  // Create initial state from character JSON
  const initialState: CharacterState = {
    hitPoints: {
      current: character.hitPoints.current,
      temporary: character.hitPoints.temporary,
      hitDiceRemaining: character.hitPoints.hitDiceRemaining,
    },
    spellSlots:
      character.spellcasting?.spellSlots.map((s) => ({
        level: s.level,
        expended: s.expended,
      })) || [],
    featureUses: getInitialFeatureUses(character),
    money: {
      gold: character.equipment.currency.gold,
      silver: character.equipment.currency.silver,
    },
  };

  await setCharacterState(character.id, initialState);
  return initialState;
}

// Merge static character data with dynamic Redis state
export function mergeCharacterWithState(
  character: Character,
  state: CharacterState
): Character {
  const merged = { ...character };

  // Merge hit points
  merged.hitPoints = {
    ...character.hitPoints,
    current: state.hitPoints.current,
    temporary: state.hitPoints.temporary,
    hitDiceRemaining: state.hitPoints.hitDiceRemaining,
  };

  // Merge money
  merged.equipment = {
    ...character.equipment,
    currency: {
      ...character.equipment.currency,
      gold: state.money.gold,
      silver: state.money.silver,
    },
  };

  // Merge spell slots
  if (character.spellcasting && state.spellSlots.length > 0) {
    merged.spellcasting = {
      ...character.spellcasting,
      spellSlots: character.spellcasting.spellSlots.map((slot) => {
        const stateSlot = state.spellSlots.find((s) => s.level === slot.level);
        return stateSlot ? { ...slot, expended: stateSlot.expended } : slot;
      }),
    };
  }

  // Merge feature uses
  if (state.featureUses && state.featureUses.length > 0) {
    merged.featuresAndTraits = character.featuresAndTraits.map((feature) => {
      if (!feature.uses) return feature;
      const stateUse = state.featureUses.find(
        (u) => u.key === getFeatureUsesKey(feature)
      );
      return stateUse
        ? { ...feature, uses: { ...feature.uses, expended: stateUse.expended } }
        : feature;
    });
  }

  return merged;
}

// Helper to update spell slots (merges with existing)
export async function updateSpellSlots(
  characterId: string,
  slotUpdates: { level: number; expended: number }[]
): Promise<boolean> {
  const state = await getCharacterState(characterId);
  if (!state) return false;

  const newSlots = state.spellSlots.map((slot) => {
    const update = slotUpdates.find((u) => u.level === slot.level);
    return update ? { ...slot, expended: update.expended } : slot;
  });

  return setCharacterState(characterId, { ...state, spellSlots: newSlots });
}
