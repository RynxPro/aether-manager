import React, { useMemo, useState } from 'react';
import PageContainer, { PageHeader } from '../components/characters/PageContainer';
import { usePresets } from '../hooks/usePresets';
import { useMods } from '../hooks/useMods';
import ModCard from '../components/ModCard';
import PresetEditDialog from '../components/PresetEditDialog';
import LoadingSpinner from '../components/characters/LoadingSpinner';
import ErrorState from '../components/characters/ErrorState';

interface PresetDetailsPageProps {
  presetId: string;
  onBack: () => void;
  onModClick: (modId: string, characterId?: string) => void;
}

const PresetDetailsPage: React.FC<PresetDetailsPageProps> = ({ presetId, onBack, onModClick }) => {
  const { presets, loading: presetsLoading, error, fetchPresets } = usePresets();
  const { mods, toggleModActive, deleteMod, fetchMods } = useMods();
  const [isEditOpen, setEditOpen] = useState(false);

  const preset = useMemo(() => presets.find(p => p.id === presetId), [presets, presetId]);
  const presetMods = useMemo(() => {
    if (!preset) return [];
    const set = new Set(preset.mod_ids);
    return mods.filter(m => set.has(m.id));
  }, [mods, preset]);

  const handleEditSuccess = async () => {
    await fetchPresets(true);
    await fetchMods(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title={preset ? preset.name : 'Preset'}
        description={preset ? `${preset.mod_ids.length} ${preset.mod_ids.length === 1 ? 'mod' : 'mods'}` : ''}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-3 py-2 rounded-lg border border-[var(--moon-border)] text-[var(--moon-text)] hover:border-[var(--moon-glow-violet)]/50"
          >
            ← Back
          </button>
          {preset && (
            <button
              onClick={() => setEditOpen(true)}
              className="px-4 py-2 rounded-lg bg-[var(--moon-accent)] hover:bg-[var(--moon-glow-violet)] text-white text-sm font-medium transition-all shadow border border-[var(--moon-glow-violet)]/40"
            >
              Edit Preset
            </button>
          )}
        </div>
      </PageHeader>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">{error}</div>
      )}

      {presetsLoading && (
        <div className="py-16"><LoadingSpinner message="Loading preset..." /></div>
      )}

      {!presetsLoading && !preset && (
        <ErrorState error="Preset not found" onRetry={() => fetchPresets()} />
      )}

      {preset && (
        <>
          {presetMods.length === 0 ? (
            <div className="rounded-xl border border-[var(--moon-border)] bg-[var(--moon-surface)] p-8 text-center text-[var(--moon-muted)]">
              This preset has no mods yet. Click "Edit Preset" to add mods.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {presetMods.map((mod) => (
                <ModCard
                  key={mod.id}
                  mod={mod}
                  onToggleActive={toggleModActive}
                  onDelete={deleteMod}
                  onViewDetails={(id) => onModClick(id, mod.character || undefined)}
                />
              ))}
            </div>
          )}

          <PresetEditDialog
            isOpen={isEditOpen}
            onClose={() => setEditOpen(false)}
            onSaved={handleEditSuccess}
            preset={preset}
          />
        </>
      )}
    </PageContainer>
  );
};

export default PresetDetailsPage;
