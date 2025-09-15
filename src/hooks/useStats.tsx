import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { invoke } from "@tauri-apps/api/core";

// Frontend type (camelCase)
export interface ModStats {
  installedMods: number;
  activeMods: number;
  inactiveMods: number;
  presets: number;
}

type UseStatsReturn = {
  stats: ModStats;
  loading: boolean;
  error: string | null;
  fetchStats: (silent?: boolean) => Promise<void>;
};

const defaultStats: ModStats = {
  installedMods: 0,
  activeMods: 0,
  inactiveMods: 0,
  presets: 0,
};

const StatsContext = createContext<UseStatsReturn | null>(null);

const useStatsInternal = (): UseStatsReturn => {
  const [stats, setStats] = useState<ModStats>(defaultStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const result = await invoke<ModStats>("get_mod_stats");
      // Rust backend now returns camelCase directly
      setStats(result);
    } catch (err) {
      if (!silent) {
        setError(err as string);
      } else {
        console.warn("Silent fetchStats failed:", err);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
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

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = useStatsInternal();
  const memoized = useMemo(
    () => value,
    [value.stats, value.loading, value.error]
  );
  return (
    <StatsContext.Provider value={memoized}>{children}</StatsContext.Provider>
  );
};

export const useStats = (): UseStatsReturn => {
  const ctx = useContext(StatsContext);
  if (!ctx) {
    throw new Error("useStats must be used within a StatsProvider");
  }
  return ctx;
};
