import React from "react";
import { usePresets } from "../hooks/usePresets";

interface PresetsPageProps {}

const PresetsPage: React.FC<PresetsPageProps> = () => {
  const { presets, loading, error, addPreset, applyPreset, deletePreset } = usePresets();

  const handleAdd = async () => {
    const name = window.prompt("Preset name (optional):", "");
    await addPreset(name ?? undefined);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--moon-text)]">Presets</h2>
        <p className="text-sm text-[var(--moon-muted)] mt-1">
          Create and manage mod presets. A preset is a saved set of active mods you can switch to quickly.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-[var(--moon-muted)]">
          {loading ? (
            <span className="text-xs">Loading presets…</span>
          ) : (
            <span className="text-xs">{presets.length} preset(s)</span>
          )}
          {error && (
            <span className="text-xs text-red-400">Error: {error}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg bg-[var(--moon-accent)]/20 text-[var(--moon-accent)] border border-[var(--moon-glow-violet)]/30 hover:bg-[var(--moon-accent)]/25 transition"
        >
          + New Preset (save current active)
        </button>
      </div>

      {presets.length === 0 ? (
        <div className="rounded-xl border border-[var(--moon-border)] bg-[var(--moon-surface)] p-6 text-[var(--moon-muted)]">
          No presets yet. Activate the mods you want, then click “New Preset”.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-[var(--moon-border)] bg-[var(--moon-surface)] p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[var(--moon-text)] truncate">
                    {p.name}
                  </div>
                  <div className="text-xs text-[var(--moon-muted)]">
                    {new Date(p.created_at).toLocaleString()} • {p.mod_ids.length} mod(s)
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => applyPreset(p.id)}
                  className="px-3 py-2 rounded-lg bg-[var(--moon-accent)]/20 text-[var(--moon-accent)] border border-[var(--moon-glow-violet)]/30 hover:bg-[var(--moon-accent)]/25 transition"
                >
                  Apply
                </button>
                <button
                  onClick={() => deletePreset(p.id)}
                  className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/15 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PresetsPage;
