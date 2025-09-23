import React, { useMemo, useState } from 'react';
import PageContainer from '../components/characters/PageContainer';
import { usePresets } from '../hooks/usePresets';
import { useMods } from '../hooks/useMods';
import ModCard from '../components/ModCard';
import PresetEditDialog from '../components/PresetEditDialog';
import LoadingSpinner from '../components/characters/LoadingSpinner';
import ErrorState from '../components/characters/ErrorState';
import { cnButton } from "../styles/buttons";

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
      {/* Back Row (match CharacterModPage) */}
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-[var(--moon-muted)] hover:text-[var(--moon-glow-violet)] hover:drop-shadow-[0_0_6px_var(--moon-glow-violet)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Presets</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--moon-text)]">{preset ? preset.name : 'Preset'}</h1>
            {preset && (
              <p className="text-sm text-[var(--moon-muted)]">{preset.mod_ids.length} {preset.mod_ids.length === 1 ? 'mod' : 'mods'}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {preset && (
            <button
              onClick={() => setEditOpen(true)}
              className={cnButton({ variant: 'primary', size: 'sm' })}
            >
              Edit Preset
            </button>
          )}
        </div>
      </div>

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
