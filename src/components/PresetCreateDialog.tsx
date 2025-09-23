import React, { useState, useEffect } from 'react';
import { usePresets } from '../hooks/usePresets';
import { useMods } from '../hooks/useMods';
import { Preset } from '../types/preset';

interface PresetCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  presetToEdit?: Preset;
}

const PresetCreateDialog: React.FC<PresetCreateDialogProps> = ({ isOpen, onClose, onSuccess, presetToEdit }) => {
  const { addPreset, updatePreset, loading } = usePresets();
  const { mods } = useMods();

  const [presetName, setPresetName] = useState('');
  const [creationMode, setCreationMode] = useState<'active' | 'select'>('active');
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (presetToEdit) {
      setPresetName(presetToEdit.name);
      setSelectedMods(presetToEdit.mod_ids);
      setCreationMode('select');
    } else {
      setPresetName('');
      setSelectedMods([]);
      setCreationMode('active');
    }
  }, [presetToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!presetName.trim()) {
      setError('Preset name is required');
      return;
    }

    try {
      let modIds: string[] | undefined = undefined;
      if (creationMode === 'select') {
        modIds = selectedMods;
      }

      let result;
      if (presetToEdit) {
        result = await updatePreset(presetToEdit.id, presetName.trim(), selectedMods);
      } else {
        result = await addPreset(presetName.trim(), modIds);
      }

      if (result) {
        setPresetName('');
        setSelectedMods([]);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      }
    } catch (err) {
      setError(`Failed to create preset: ${err}`);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setPresetName('');
      setSelectedMods([]);
      setError(null);
      onClose();
    }
  };

  const toggleModSelection = (modId: string) => {
    setSelectedMods(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--moon-surface)] rounded-xl border border-[var(--moon-border)] w-full max-w-lg">
        <div className="px-6 pt-5 pb-4 border-b border-[var(--moon-border)]">
          <h2 className="text-xl font-bold text-[var(--moon-text)]">{presetToEdit ? 'Edit Preset' : 'Create New Preset'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">Preset Name</label>
            <input
              type="text"
              value={presetName}
              onChange={e => setPresetName(e.target.value)}
              placeholder="Enter a name for your preset"
              className="w-full px-4 py-2.5 bg-[var(--moon-surface-elevated)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)]"
            />
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => setCreationMode('active')} className={`flex-1 p-2 rounded ${creationMode === 'active' ? 'bg-blue-500' : 'bg-gray-700'}`}>Save Current Active Mods</button>
            <button type="button" onClick={() => setCreationMode('select')} className={`flex-1 p-2 rounded ${creationMode === 'select' ? 'bg-blue-500' : 'bg-gray-700'}`}>Select Mods</button>
          </div>

          {creationMode === 'select' && (
            <div className="max-h-60 overflow-y-auto">
              {mods.map(mod => (
                <div key={mod.id} className="flex items-center justify-between p-2">
                  <label htmlFor={`mod-${mod.id}`}>{mod.title}</label>
                  <input type="checkbox" id={`mod-${mod.id}`} checked={selectedMods.includes(mod.id)} onChange={() => toggleModSelection(mod.id)} />
                </div>
              ))}
            </div>
          )}

          {error && <div className="text-red-500">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleClose} disabled={loading} className="px-5 py-2.5 text-sm font-medium rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-blue-500 text-white rounded-lg">{loading ? (presetToEdit ? 'Saving...' : 'Creating...') : (presetToEdit ? 'Save Changes' : 'Create Preset')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresetCreateDialog;
