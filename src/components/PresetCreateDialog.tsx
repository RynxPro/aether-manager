import React, { useState, useEffect, useMemo } from "react";
import { usePresets } from "../hooks/usePresets";
import { useMods } from "../hooks/useMods";
import { Preset } from "../types/preset";

interface PresetCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  presetToEdit?: Preset;
}

const PresetCreateDialog: React.FC<PresetCreateDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  presetToEdit,
}) => {
  const { addPreset, updatePreset, loading } = usePresets();
  const { mods } = useMods();

  const [presetName, setPresetName] = useState("");
  const [creationMode, setCreationMode] = useState<"active" | "select">(
    "active"
  );
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (presetToEdit) {
      setPresetName(presetToEdit.name);
      setSelectedMods(presetToEdit.mod_ids);
      setCreationMode("select");
    } else {
      setPresetName("");
      setSelectedMods([]);
      setCreationMode("active");
    }
  }, [presetToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!presetName.trim()) {
      setError("Preset name is required");
      return;
    }

    try {
      let modIds: string[] | undefined = undefined;
      if (creationMode === "select") {
        modIds = selectedMods;
      }

      let result;
      if (presetToEdit) {
        result = await updatePreset(
          presetToEdit.id,
          presetName.trim(),
          selectedMods
        );
      } else {
        result = await addPreset(presetName.trim(), modIds);
      }

      if (result) {
        setPresetName("");
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
      setPresetName("");
      setSelectedMods([]);
      setError(null);
      onClose();
    }
  };

  const toggleModSelection = (modId: string) => {
    setSelectedMods((prev) =>
      prev.includes(modId)
        ? prev.filter((id) => id !== modId)
        : [...prev, modId]
    );
  };

  const filteredMods = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mods;
    return mods.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.description && m.description.toLowerCase().includes(q))
    );
  }, [mods, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--moon-surface)] rounded-2xl border border-[var(--moon-border)] w-full max-w-2xl shadow-xl overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-[var(--moon-border)] flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--moon-text)]">
              {presetToEdit ? "Edit Preset" : "Create New Preset"}
            </h2>
            <p className="text-[var(--moon-muted)] text-sm mt-1">
              {creationMode === "active"
                ? "Save your current active mods as a preset."
                : "Pick specific mods to include in this preset."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-[var(--moon-muted)] hover:text-[var(--moon-text)] transition-colors"
            aria-label="Close dialog"
            disabled={loading}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
              Preset Name
            </label>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Enter a name for your preset"
              className="w-full px-4 py-2.5 bg-[var(--moon-surface-elevated)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--moon-accent)] focus:border-transparent transition"
            />
            <p className="text-xs text-[var(--moon-muted)] mt-1">
              Give your preset a short, memorable name.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[var(--moon-surface-elevated)] p-1 rounded-lg border border-[var(--moon-border)]">
            <button
              type="button"
              onClick={() => setCreationMode("active")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                creationMode === "active"
                  ? "bg-[var(--moon-accent)] text-white"
                  : "text-[var(--moon-text)] hover:bg-[var(--moon-surface)]"
              }`}
            >
              Use Current Active Mods
            </button>
            <button
              type="button"
              onClick={() => setCreationMode("select")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                creationMode === "select"
                  ? "bg-[var(--moon-accent)] text-white"
                  : "text-[var(--moon-text)] hover:bg-[var(--moon-surface)]"
              }`}
            >
              Select Specific Mods
            </button>
          </div>

          {creationMode === "select" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search mods..."
                  className="flex-1 px-4 py-2.5 bg-[var(--moon-surface-elevated)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--moon-accent)] focus:border-transparent transition"
                />
                <span className="text-xs text-[var(--moon-muted)] whitespace-nowrap">
                  {filteredMods.length}{" "}
                  {filteredMods.length === 1 ? "mod" : "mods"}
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto rounded-lg border border-[var(--moon-border)]">
                {filteredMods.length === 0 ? (
                  <div className="p-6 text-center text-[var(--moon-muted)] text-sm">
                    No mods match your search.
                  </div>
                ) : (
                  <ul className="divide-y divide-[var(--moon-border)]">
                    {filteredMods.map((mod) => (
                      <li
                        key={mod.id}
                        className="flex items-center justify-between px-4 py-3 hover:bg-[var(--moon-surface)] transition"
                      >
                        <div className="min-w-0">
                          <div
                            className="text-sm text-[var(--moon-text)] truncate"
                            title={mod.title}
                          >
                            {mod.title}
                          </div>
                          <div className="text-xs text-[var(--moon-muted)] truncate">
                            {mod.character
                              ? `Character: ${mod.character}`
                              : "Other Mods"}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedMods.includes(mod.id)}
                          onChange={() => toggleModSelection(mod.id)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium rounded-lg border border-[var(--moon-border)] bg-[var(--moon-surface-elevated)] text-[var(--moon-text)] hover:bg-[var(--moon-surface)] transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !presetName.trim()}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-[var(--moon-accent)] hover:bg-[var(--moon-glow-violet)] text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? presetToEdit
                  ? "Saving..."
                  : "Creating..."
                : presetToEdit
                ? "Save Changes"
                : "Create Preset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresetCreateDialog;
