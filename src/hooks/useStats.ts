import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

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
      const result = await invoke<ModStats>('get_mod_stats');
      // Rust backend now returns camelCase directly
      setStats(result);
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
