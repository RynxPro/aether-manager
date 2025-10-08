import { useState, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export interface AppSettings {
  zzmiModsPath?: string; // Path to zzmi/mods folder for active mods
}

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<any>("get_settings");
      const zzmi = result?.zzmi_mods_path;
      setSettings({
        zzmiModsPath:
          typeof zzmi === "string" && zzmi.trim() !== "" ? zzmi : undefined,
      });
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: AppSettings): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // Convert camelCase to snake_case for Rust
      const rustSettings = {
        zzmi_mods_path: newSettings.zzmiModsPath,
      };

      await invoke("update_settings", { settings: rustSettings });
      setSettings(newSettings);
      return true;
    } catch (err) {
      setError(err as string);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const selectFolder = async (title: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      // Prefer Tauri dialog plugin for better cross-platform support (especially Windows)
      const result = await open({ directory: true, multiple: false, title });
      if (!result) return null;
      if (Array.isArray(result)) {
        return result[0] ?? null;
      }
      return result as string;
    } catch (err) {
      setError(err as string);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const isValid = useMemo(() => {
    return Boolean(
      settings.zzmiModsPath && settings.zzmiModsPath.trim() !== ""
    );
  }, [settings.zzmiModsPath]);

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    isValid,
    fetchSettings,
    updateSettings,
    selectFolder,
  };
};
