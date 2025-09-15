import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { invoke } from "@tauri-apps/api/core";
import { Mod as UnifiedMod } from "../types/mod";

// Rust backend response type (snake_case)
interface RustMod {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  is_active: boolean;
  date_added: string;
  character?: string;
  file_path: string;
  original_name: string;
}

// Frontend type (camelCase)
export type Mod = UnifiedMod;

export interface ModStats {
  installedMods: number;
  activeMods: number;
  inactiveMods: number;
  presets: number;
}

type UseModsReturn = {
  mods: Mod[];
  loading: boolean;
  error: string | null;
  fetchMods: () => Promise<void>;
  installMod: (
    filePath: string,
    title: string,
    character?: string,
    description?: string,
    thumbnail?: string
  ) => Promise<Mod | null>;
  toggleModActive: (modId: string) => Promise<boolean>;
  deleteMod: (modId: string) => Promise<boolean>;
  updateMod: (
    modId: string,
    updates: { title?: string; thumbnail?: string; description?: string }
  ) => Promise<boolean>;
};

const ModsContext = createContext<UseModsReturn | null>(null);

const useModsInternal = (): UseModsReturn => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMods = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<RustMod[]>("get_mods");
      // Convert snake_case from Rust to camelCase for React
      const convertedMods: Mod[] = result.map((mod) => ({
        id: mod.id,
        title: mod.title,
        description: mod.description,
        thumbnail: mod.thumbnail,
        isActive: mod.is_active,
        dateAdded: mod.date_added,
        character: mod.character,
        filePath: mod.file_path,
        originalName: mod.original_name,
      }));
      setMods(convertedMods);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const installMod = async (
    filePath: string,
    title: string,
    character?: string,
    description?: string,
    thumbnail?: string
  ): Promise<Mod | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<RustMod>("install_mod", {
        filePath,
        title,
        character,
        description,
        thumbnail,
      });

      // Convert snake_case to camelCase
      const convertedMod: Mod = {
        id: result.id,
        title: result.title,
        description: result.description,
        thumbnail: result.thumbnail,
        isActive: result.is_active,
        dateAdded: result.date_added,
        character: result.character,
        filePath: result.file_path,
        originalName: result.original_name,
      };

      setMods((prev) => [...prev, convertedMod]);
      return convertedMod;
    } catch (err) {
      console.error("installMod error details:", err);
      console.error("Error type:", typeof err);
      console.error("Error string:", String(err));
      setError(err as string);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const toggleModActive = async (modId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      console.log("Toggling mod active:", modId);

      // Get current state before toggling
      const currentMod = mods.find((mod) => mod.id === modId);
      if (!currentMod) {
        throw new Error("Mod not found");
      }

      // Optimistically update UI
      setMods((prev) =>
        prev.map((mod) =>
          mod.id === modId ? { ...mod, isActive: !mod.isActive } : mod
        )
      );

      // Call backend (returns new is_active state, but false can be valid when deactivating)
      const result = await invoke<boolean>("toggle_mod_active", { modId });
      console.log("Toggle result (new is_active):", result);
      return true;
    } catch (err) {
      console.error("toggleModActive error:", err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Failed to toggle mod: ${errorMsg}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMod = async (modId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await invoke("delete_mod", { modId });

      // Remove from local state
      setMods((prev) => prev.filter((mod) => mod.id !== modId));

      return true;
    } catch (err) {
      setError(err as string);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMod = async (
    modId: string,
    updates: {
      title?: string;
      thumbnail?: string;
      description?: string;
    }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await invoke("update_mod", { modId, ...updates });

      // Update local state
      setMods((prev) =>
        prev.map((mod) =>
          mod.id === modId
            ? {
                ...mod,
                title: updates.title ?? mod.title,
                thumbnail: updates.thumbnail ?? mod.thumbnail,
                description: updates.description ?? mod.description,
              }
            : mod
        )
      );

      return true;
    } catch (err) {
      setError(err as string);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMods();
  }, []);

  return {
    mods,
    loading,
    error,
    fetchMods,
    installMod,
    toggleModActive,
    deleteMod,
    updateMod,
  };
};

export const ModsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useModsInternal();
  const memoizedValue = useMemo(
    () => value,
    [value.mods, value.loading, value.error]
  );
  return (
    <ModsContext.Provider value={memoizedValue}>
      {children}
    </ModsContext.Provider>
  );
};

export const useMods = (): UseModsReturn => {
  const ctx = useContext(ModsContext);
  if (!ctx) {
    // Fallback to an isolated instance to avoid crashes, but advise wrapping with provider
    console.warn(
      "useMods called outside of ModsProvider. State will not persist across pages."
    );
    return useModsInternal();
  }
  return ctx;
};
