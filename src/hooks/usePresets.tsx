import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Preset } from "../types/preset";
import { useMods } from "./useMods";
import { useStats } from "./useStats";
import { toast } from "react-hot-toast";

interface UsePresetsReturn {
  presets: Preset[];
  loading: boolean;
  error: string | null;
  fetchPresets: (silent?: boolean) => Promise<void>;
  addPreset: (name: string, modIds?: string[]) => Promise<Preset | null>;
  applyPreset: (presetId: string) => Promise<boolean>;
  deletePreset: (presetId: string) => Promise<boolean>;
  updatePreset: (presetId: string, name: string, modIds: string[]) => Promise<boolean>;
}

const PresetsContext = createContext<UsePresetsReturn | null>(null);

const usePresetsInternal = (): UsePresetsReturn => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchMods } = useMods();
  const { fetchStats } = useStats();

  const fetchPresets = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const result = await invoke<Preset[]>("list_presets");
      setPresets(result ?? []);
    } catch (err) {
      if (!silent) setError(String(err));
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const addPreset = async (name: string, modIds?: string[]): Promise<Preset | null> => {
    setLoading(true);
    setError(null);
    try {
      const created = await invoke<Preset>("create_preset", { name, modIds });
      await fetchPresets(true);
      await fetchStats(true);
      toast.success(`Preset "${created.name}" created`);
      return created;
    } catch (err) {
      const msg = String(err);
      setError(msg);
      toast.error(`Failed to create preset: ${msg}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = async (presetId: string): Promise<boolean> => {
    setError(null);
    try {
      await invoke("apply_preset", { presetId });
      await Promise.all([fetchMods(true), fetchStats(true)]);
      const presetName = presets.find((p) => p.id === presetId)?.name ?? "Preset";
      toast.success(`${presetName} applied`);
      return true;
    } catch (err) {
      const msg = String(err);
      setError(msg);
      toast.error(`Failed to apply preset: ${msg}`);
      return false;
    }
  };

  const deletePreset = async (presetId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const presetName = presets.find((p) => p.id === presetId)?.name ?? "Preset";
      await invoke("delete_preset", { presetId });
      await fetchPresets(true);
      await fetchStats(true);
      toast.success(`${presetName} deleted`);
      return true;
    } catch (err) {
      const msg = String(err);
      setError(msg);
      toast.error(`Failed to delete preset: ${msg}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePreset = async (presetId: string, name: string, modIds: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await invoke("update_preset", { presetId, name, modIds });
      await fetchPresets(true);
      toast.success(`Preset "${name}" updated`);
      return true;
    } catch (err) {
      const msg = String(err);
      setError(msg);
      toast.error(`Failed to update preset: ${msg}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresets();
  }, []);

  return {
    presets,
    loading,
    error,
    fetchPresets,
    addPreset,
    applyPreset,
    deletePreset,
    updatePreset,
  };
};

export const PresetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = usePresetsInternal();
  const memoizedValue = useMemo(() => value, [value.presets, value.loading, value.error]);
  return <PresetsContext.Provider value={memoizedValue}>{children}</PresetsContext.Provider>;
};

export const usePresets = (): UsePresetsReturn => {
  const ctx = useContext(PresetsContext);
  if (!ctx) throw new Error("usePresets must be used within a PresetsProvider");
  return ctx;
};
