import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

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
      // Convert snake_case from Rust to camelCase for React
      setSettings({
        zzmiModsPath: result.zzmi_mods_path,
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
      const result = await invoke<string | null>("select_folder", { title });
      return result;
    } catch (err) {
      setError(err as string);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    selectFolder,
  };
};
