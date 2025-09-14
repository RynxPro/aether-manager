import React, { useState } from "react";
import { useMods } from "../hooks/useMods";
import { useCharacters } from "../hooks/useCharacters";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface ModInstallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialCharacterId?: string;
}

const ModInstallDialog: React.FC<ModInstallDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCharacterId = ""
}) => {
  const { installMod, loading } = useMods();
  const { characters, loading: loadingCharacters } = useCharacters();

  const [formData, setFormData] = useState({
    title: "",
    character: "",
    description: "",
    filePath: "",
    thumbnail: "",
  });

  // Update character when initialCharacterId or characters change
  React.useEffect(() => {
    if (initialCharacterId && !loadingCharacters && formData.character !== initialCharacterId) {
      const characterExists = characters.some(c => c.id === initialCharacterId);
      if (characterExists) {
        setFormData(prev => ({
          ...prev,
          character: initialCharacterId
        }));
      }
    }
  }, [initialCharacterId, characters, loadingCharacters, formData.character]);
  const [error, setError] = useState<string | null>(null);

  const handleFolderSelect = async () => {
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const selected = await invoke<string | null>("select_mod_folder");

      if (selected) {
        setFormData((prev) => ({ ...prev, filePath: selected }));

        // Auto-generate title from folder name if not set
        if (!formData.title) {
          const foldername = selected.split("/").pop() || "";
          setFormData((prev) => ({ ...prev, title: foldername }));
        }
      }
    } catch (err) {
      setError("Failed to select folder");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.filePath) {
      setError("Please select a mod folder");
      return;
    }

    try {
      console.log("Installing mod with data:", formData);
      console.log("Calling installMod with params:", {
        filePath: formData.filePath,
        title: formData.title.trim(),
        character: formData.character || undefined,
        description: formData.description.trim() || undefined,
      });

      const result = await installMod(
        formData.filePath,
        formData.title.trim(),
        formData.character || undefined,
        formData.description.trim() || undefined,
        formData.thumbnail.trim() || undefined
      );

      console.log("Installation result:", result);
      console.log("Result type:", typeof result);

      if (result) {
        // Reset form
        setFormData({
          title: "",
          character: "",
          description: "",
          filePath: "",
          thumbnail: "",
        });

        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        setError("Installation failed - no result returned");
      }
    } catch (err) {
      console.error("Mod installation error:", err);
      setError(`Failed to install mod: ${err}`);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: "",
        character: "",
        description: "",
        filePath: "",
        thumbnail: "",
      });
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--moon-surface)] rounded-xl border border-[var(--moon-border)] w-full max-w-lg transform transition-all duration-200 ease-out">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[var(--moon-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--moon-text)]">Install New Mod</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-[var(--moon-muted)] hover:text-[var(--moon-text)] transition-colors disabled:opacity-50 p-1 -mr-2"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-[var(--moon-muted)]">
            Add a new mod to your collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Folder Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-[var(--moon-text)]">
                Mod Folder
              </label>
              <span className="text-xs text-[var(--moon-muted)]">Required</span>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={
                    formData.filePath ? formData.filePath.split("/").pop() : ""
                  }
                  placeholder="No folder selected"
                  readOnly
                  className="w-full px-4 py-2.5 bg-[var(--moon-surface-elevated)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--moon-accent)] focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed truncate"
                />
                {formData.filePath && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, filePath: '' }))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--moon-muted)] hover:text-[var(--moon-text)] transition-colors"
                    disabled={loading}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleFolderSelect}
                disabled={loading}
                className="px-4 py-2.5 bg-[var(--moon-accent)] hover:bg-[var(--moon-glow-violet)] text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Browse
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-[var(--moon-text)]">
                Mod Title
              </label>
              <span className="text-xs text-[var(--moon-muted)]">Required</span>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter a descriptive name"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-[var(--moon-surface-elevated)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--moon-accent)] focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Character Selection */}
          <div>
            <Listbox
              value={formData.character}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  character: value,
                }))
              }
              disabled={loading}
            >
              <div className="relative">
                <Listbox.Label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
                  Character (Optional)
                </Listbox.Label>
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-[var(--moon-surface-elevated)] py-2.5 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--moon-accent)] sm:text-sm border border-[var(--moon-border)] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading || loadingCharacters}>
                  <div className="flex items-center">
                    {loadingCharacters ? (
                      <span className="text-[var(--moon-muted)]">Loading characters...</span>
                    ) : formData.character ? (
                      <>
                        {characters.find(c => c.id === formData.character)?.iconUrl && (
                          <img
                            src={characters.find(c => c.id === formData.character)?.iconUrl}
                            alt=""
                            className="h-5 w-5 flex-shrink-0 rounded-full"
                          />
                        )}
                        <span className="ml-3 block truncate">
                          {characters.find(c => c.id === formData.character)?.name || 'Unknown Character'}
                        </span>
                      </>
                    ) : (
                      <span className="text-[var(--moon-muted)]">Select a character</span>
                    )}
                  </div>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[var(--moon-surface)] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50 border border-[var(--moon-border)] backdrop-blur-md bg-opacity-100">
                  <Listbox.Option
                    value=""
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-[var(--moon-accent)]/10 text-[var(--moon-text)]' : 'text-[var(--moon-text)]'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          No specific character
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--moon-accent)]">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  {characters.map((character) => (
                    <Listbox.Option
                      key={character.id}
                      value={character.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-[var(--moon-accent)]/10 text-[var(--moon-text)]' : 'text-[var(--moon-text)]'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <div className="flex items-center">
                            {character.iconUrl && (
                              <img
                                src={character.iconUrl}
                                alt=""
                                className="h-5 w-5 flex-shrink-0 rounded-full"
                              />
                            )}
                            <span className={`ml-3 block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {character.name}
                            </span>
                          </div>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--moon-accent)]">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
              Mod URL
              <span className="text-[var(--moon-muted)] text-xs font-normal ml-1">(optional)</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="https://example.com/mod-page"
                disabled={loading}
                className="w-full px-4 py-2.5 bg-[var(--moon-surface-elevated)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--moon-accent)] focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
              Thumbnail URL
              <span className="text-[var(--moon-muted)] text-xs font-normal ml-1">(optional)</span>
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/thumbnail.jpg"
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-[var(--moon-surface-elevated)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--moon-accent)] focus:border-transparent transition-all disabled:opacity-60"
                />
              </div>
              {formData.thumbnail && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-[var(--moon-border)] bg-[var(--moon-surface-elevated)] flex-shrink-0">
                  <img 
                    src={formData.thumbnail} 
                    alt="Thumbnail preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyOGIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xOCAxM2w1LjI0MyA1LjI0M2ExLjEyNiAxLjEyNiAwIDAgMS0uMzYxLjgxOWwtLjExMy4xYTEuMTU4IDEuMTU4IDAgMCAxLTEuNTQ1IDBsLTUuMjQ1LTUuMjQ0TTE4IDEzVjUuNWEyLjUgMi41IDAgMCAwLTIuNS0yLjVoLTExQTIuNSAyLjUgMCAwIDAyIDUuNXYxM0EyLjUgMi41IDAgMCAwNC41IDIxaDExYTIuNSAyLjUgMCAwMDIuNS0yLjVWMTN6Ii8+PHBhdGggZD0iTTEwIDkuNWExLjUgMS41IDAgMTAwLTMgMS41IDEuNSAwIDAwMCAzeiIvPjwvc3ZnPg==';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800/50 text-red-200 text-sm rounded-lg flex items-start gap-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-[var(--moon-text)] hover:bg-[var(--moon-surface-hover)] rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.filePath}
              className="px-5 py-2.5 bg-[var(--moon-accent)] hover:bg-[var(--moon-glow-violet)] text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_var(--moon-glow-violet)]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Installing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Install Mod
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModInstallDialog;
