import React, { useState } from 'react';
import { usePresets } from '../hooks/usePresets';
import PresetCreateDialog from '../components/PresetCreateDialog';
import { Preset } from '../types/preset';
import PageContainer, { PageHeader } from '../components/characters/PageContainer';
import ConfirmDialog from '../components/ConfirmDialog';
import { cnButton } from '../styles/buttons';
import { useMods } from '../hooks/useMods';

interface PresetsPageProps {
  onPresetClick?: (presetId: string) => void;
}

const PresetsPage: React.FC<PresetsPageProps> = ({ onPresetClick }) => {
  const { presets, loading, error, applyPreset, deletePreset } = usePresets();
  const { mods } = useMods();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Preset | null>(null);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Presets"
        description="Create and manage mod presets. Quickly switch between saved sets of active mods."
      >
        <div className="flex items-center gap-3">
          <div className="text-sm text-[var(--moon-muted)]">
            {loading ? "Loading…" : `${presets.length} ${presets.length === 1 ? 'preset' : 'presets'}`}
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className={cnButton({ variant: 'primary', className: 'flex items-center gap-2' })}
            title="Create a new preset"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Preset</span>
          </button>
        </div>
      </PageHeader>

      <PresetCreateDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}

      {presets.length === 0 ? (
        <div className="mb-8">
          <div className="rounded-xl border border-[var(--moon-border)] bg-[var(--moon-surface)] p-8 text-center">
            <div className="text-3xl mb-2">🎛️</div>
            <h3 className="text-lg font-semibold text-[var(--moon-text)]">No presets yet</h3>
            <p className="text-[var(--moon-muted)] mt-1">
              Create your first preset from the current active mods or by selecting mods.
            </p>
            <button
              onClick={() => setDialogOpen(true)}
              className="mt-4 px-4 py-2 rounded-lg bg-[var(--moon-accent)] hover:bg-[var(--moon-glow-violet)] text-white text-sm font-medium transition-all shadow border border-[var(--moon-glow-violet)]/40"
            >
              Create Preset
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {presets.map((p) => {
            const activeIds = new Set(mods.filter(m => m.isActive).map(m => m.id));
            const isApplied = p.mod_ids.length === activeIds.size && p.mod_ids.every(id => activeIds.has(id));
            return (
            <div
              key={p.id}
              className="bg-[var(--moon-surface)] rounded-xl border border-[var(--moon-border)] overflow-hidden flex flex-col hover:border-[var(--moon-glow-violet)] hover:shadow-[0_0_15px_rgba(122,90,248,0.2)] transition-all duration-300 cursor-pointer"
              onClick={() => onPresetClick?.(p.id)}
            >
              <div className="p-5 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[var(--moon-text)] font-semibold truncate" title={p.name}>{p.name}</h3>
                  <div className="flex items-center gap-2">
                    {isApplied && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 whitespace-nowrap">Applied</span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--moon-bg)] border border-[var(--moon-border)] text-[var(--moon-muted)] whitespace-nowrap">
                      {p.mod_ids.length} {p.mod_ids.length === 1 ? 'mod' : 'mods'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-[var(--moon-muted)]">
                  {new Date(p.created_at).toLocaleString()}
                </div>
                <div className="mt-auto pt-3 border-t border-[var(--moon-border)]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    <button
                      onClick={() => applyPreset(p.id)}
                      disabled={isApplied}
                      className={`px-2 py-1 text-xs rounded-lg border transition ${
                        isApplied
                          ? 'bg-gray-500/10 text-gray-400 border-gray-500/30 cursor-not-allowed'
                          : 'bg-[var(--moon-accent)]/20 text-[var(--moon-accent)] border-[var(--moon-glow-violet)]/30 hover:bg-[var(--moon-accent)]/25'
                      }`}
                    >
                      {isApplied ? 'Applied' : 'Apply'}
                    </button>
                    <button
                      onClick={() => setDeleting(p)}
                      className="px-2 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/15 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleting}
        title="Delete Preset"
        message={deleting ? `Are you sure you want to delete "${deleting.name}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleting) {
            deletePreset(deleting.id);
            setDeleting(null);
          }
        }}
        onCancel={() => setDeleting(null)}
      />
    </PageContainer>
  );
};

export default PresetsPage;
