import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

// Rust backend response type (snake_case)
interface RustModStats {
  installed_mods: number;
  active_mods: number;
  inactive_mods: number;
  presets: number;
}

// Frontend type (camelCase)
export interface ModStats {
  installedMods: number;
  activeMods: number;
  inactiveMods: number;
  presets: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<ModStats>({
    installedMods: 0,
    activeMods: 0,
    inactiveMods: 0,
    presets: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<RustModStats>('get_mod_stats');
      // Convert snake_case from Rust to camelCase for React
      setStats({
        installedMods: result.installed_mods,
        activeMods: result.active_mods,
        inactiveMods: result.inactive_mods,
        presets: result.presets,
      });
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
  };
};
