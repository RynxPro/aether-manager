import React, { useEffect, useMemo, useState } from 'react';
import { useMods } from '../hooks/useMods';
import { usePresets } from '../hooks/usePresets';
import { Preset } from '../types/preset';

interface PresetEditDialogProps {
  isOpen: boolean;
  preset: Preset;
  onClose: () => void;
  onSaved?: () => void;
}

const PresetEditDialog: React.FC<PresetEditDialogProps> = ({ isOpen, preset, onClose, onSaved }) => {
  const { mods } = useMods();
  const { updatePreset, loading } = usePresets();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (preset) {
      setSelected(new Set(preset.mod_ids));
    }
  }, [preset]);

  const filteredMods = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return mods;
    return mods.filter(m => m.title.toLowerCase().includes(q) || (m.description?.toLowerCase().includes(q)));
  }, [mods, filter]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    const ids = Array.from(selected);
    const ok = await updatePreset(preset.id, preset.name, ids);
    if (ok) {
      if (onSaved) onSaved();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--moon-surface)] rounded-xl border border-[var(--moon-border)] w-full max-w-5xl overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-[var(--moon-border)] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--moon-text)]">Edit Preset</h2>
            <p className="text-sm text-[var(--moon-muted)]">Select which mods belong to this preset</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search mods..."
              className="px-3 py-2 rounded-lg bg-[var(--moon-surface-elevated)] border border-[var(--moon-border)] text-[var(--moon-text)] outline-none focus:border-[var(--moon-glow-violet)]/60"
            />
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {filteredMods.length === 0 ? (
            <div className="text-center text-[var(--moon-muted)]">No mods match your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMods.map((m) => {
                const isSelected = selected.has(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => toggle(m.id)}
                    className={`text-left rounded-xl border transition-all overflow-hidden ${
                      isSelected
                        ? 'border-[var(--moon-glow-violet)] bg-[var(--moon-accent)]/10 shadow-[0_0_15px_rgba(122,90,248,0.15)]'
                        : 'border-[var(--moon-border)] bg-[var(--moon-surface)] hover:border-[var(--moon-glow-violet)]/50'
                    }`}
                  >
                    <div className="aspect-video bg-gray-900/20">
                      {m.thumbnail ? (
                        <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--moon-muted)] text-xs">No preview</div>
                      )}
                    </div>
                    <div className="p-3 flex items-start gap-2">
                      <input type="checkbox" checked={isSelected} readOnly className="mt-1" />
                      <div className="min-w-0">
                        <div className="text-[var(--moon-text)] font-medium truncate" title={m.title}>{m.title}</div>
                        {m.character && (
                          <div className="text-xs text-[var(--moon-muted)] truncate">{m.character}</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[var(--moon-border)] flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-[var(--moon-border)] text-[var(--moon-text)] hover:border-[var(--moon-glow-violet)]/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[var(--moon-accent)] hover:bg-[var(--moon-glow-violet)] text-white text-sm font-medium transition-all shadow border border-[var(--moon-glow-violet)]/40"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresetEditDialog;
