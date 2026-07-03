"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapImage, MapRotation, MapState, MapTokenState } from "@/types/map";
import { fileToCompressedDataUrl } from "@/lib/map-image";
import {
  normalizeRotation,
  rotatedImageDims,
  rotateToken90CW,
} from "@/lib/map-helpers";

// Même fonctionnement que la mise à jour des stats : polling périodique
// côté lecture, écriture immédiate côté action, un petit delta de
// rafraîchissement est accepté
const POLL_INTERVAL_MS = 4000;
// Un pion déplacé localement garde sa position le temps que le serveur
// renvoie un état qui inclut notre écriture (> intervalle de polling)
const OVERRIDE_TTL_MS = 8000;

export interface LiveMapApi {
  state: MapState | null;
  image: MapImage | null;
  loaded: boolean;
  uploading: boolean;
  updateToken: (id: string, token: MapTokenState) => void;
  setMapWidthMeters: (meters: number) => void;
  rotateImage: () => void;
  uploadImage: (file: File) => Promise<boolean>;
  removeImage: () => Promise<void>;
}

export function useLiveMap(): LiveMapApi {
  const [state, setState] = useState<MapState | null>(null);
  const [image, setImage] = useState<MapImage | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const stateRef = useRef<MapState | null>(null);
  const imageIdRef = useRef<string | null | undefined>(undefined);
  const overridesRef = useRef(
    new Map<string, { token: MapTokenState; at: number }>()
  );

  const applyServerState = useCallback((server: MapState) => {
    const now = Date.now();
    const tokens = { ...server.tokens };
    for (const [id, override] of overridesRef.current) {
      if (now - override.at < OVERRIDE_TTL_MS) {
        tokens[id] = override.token;
      } else {
        overridesRef.current.delete(id);
      }
    }
    const next: MapState = { ...server, tokens };
    stateRef.current = next;
    setState(next);

    // Ne recharge l'image (gros payload) que si elle a changé
    if (server.imageId !== imageIdRef.current) {
      imageIdRef.current = server.imageId;
      overridesRef.current.clear();
      if (server.imageId) {
        fetch("/api/map/image")
          .then((res) => res.json())
          .then((data) => setImage(data.image ?? null))
          .catch((error) =>
            console.error("Failed to load map image:", error)
          );
      } else {
        setImage(null);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/map");
      const data = await res.json();
      if (data.state) applyServerState(data.state);
    } catch (error) {
      console.error("Failed to load map state:", error);
    }
  }, [applyServerState]);

  useEffect(() => {
    refresh().finally(() => setLoaded(true));
    const intervalId = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [refresh]);

  const patch = useCallback(
    async (body: Record<string, unknown>) => {
      try {
        const res = await fetch("/api/map", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageId: imageIdRef.current ?? null,
            ...body,
          }),
        });
        const data = await res.json();
        if (data.state) applyServerState(data.state);
      } catch (error) {
        console.error("Failed to update map state:", error);
      }
    },
    [applyServerState]
  );

  const updateToken = useCallback(
    (id: string, token: MapTokenState) => {
      overridesRef.current.set(id, { token, at: Date.now() });
      const current = stateRef.current;
      if (current) {
        const next = {
          ...current,
          tokens: { ...current.tokens, [id]: token },
        };
        stateRef.current = next;
        setState(next);
      }
      patch({ tokens: { [id]: token } });
    },
    [patch]
  );

  const setMapWidthMeters = useCallback(
    (meters: number) => {
      const current = stateRef.current;
      if (current) {
        const next = { ...current, mapWidthMeters: meters };
        stateRef.current = next;
        setState(next);
      }
      patch({ mapWidthMeters: meters });
    },
    [patch]
  );

  // Pivote l'image de 90° dans le sens horaire. L'image stockée reste
  // inchangée : on fait pivoter l'affichage et on migre les pions + l'échelle
  // pour qu'ils restent cohérents avec la nouvelle orientation.
  const rotateImage = useCallback(() => {
    const current = stateRef.current;
    if (!current || !image) return;

    const rotation = normalizeRotation(current.rotation);
    const nextRotation = (((rotation + 90) % 360) as MapRotation);
    const { width: dispW, height: dispH } = rotatedImageDims(
      image.width,
      image.height,
      rotation
    );

    const nextTokens: Record<string, MapTokenState> = {};
    for (const [id, token] of Object.entries(current.tokens)) {
      nextTokens[id] = rotateToken90CW(token);
    }
    // Après une rotation de 90°, la largeur affichée devient l'ancienne
    // hauteur : on ajuste l'échelle pour garder les distances réelles
    const nextWidth = Math.max(
      1,
      Math.min(1000, current.mapWidthMeters * (dispH / dispW))
    );

    overridesRef.current.clear();
    const next: MapState = {
      ...current,
      rotation: nextRotation,
      mapWidthMeters: nextWidth,
      tokens: nextTokens,
    };
    stateRef.current = next;
    setState(next);
    patch({
      rotation: nextRotation,
      mapWidthMeters: nextWidth,
      tokens: nextTokens,
    });
  }, [image, patch]);

  const uploadImage = useCallback(
    async (file: File): Promise<boolean> => {
      setUploading(true);
      try {
        const compressed = await fileToCompressedDataUrl(file);
        const res = await fetch("/api/map/image", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(compressed),
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        overridesRef.current.clear();
        imageIdRef.current = data.state.imageId;
        setImage({ ...data.image, dataUrl: compressed.dataUrl });
        stateRef.current = data.state;
        setState(data.state);
        return true;
      } catch (error) {
        console.error("Failed to upload map image:", error);
        return false;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const removeImage = useCallback(async () => {
    try {
      const res = await fetch("/api/map/image", { method: "DELETE" });
      const data = await res.json();
      overridesRef.current.clear();
      imageIdRef.current = null;
      setImage(null);
      if (data.state) {
        stateRef.current = data.state;
        setState(data.state);
      }
    } catch (error) {
      console.error("Failed to delete map image:", error);
    }
  }, []);

  return {
    state,
    image,
    loaded,
    uploading,
    updateToken,
    setMapWidthMeters,
    rotateImage,
    uploadImage,
    removeImage,
  };
}
