import React, { useState } from "react";
import { useMods } from "../hooks/useMods";
import { useCharacters } from "../hooks/useCharacters";

interface ModInstallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ModInstallDialog: React.FC<ModInstallDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { installMod, loading } = useMods();
  const { characters } = useCharacters();
  
  const [formData, setFormData] = useState({
    title: "",
    character: "",
    description: "",
    filePath: "",
    thumbnail: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleFolderSelect = async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const selected = await invoke<string | null>('select_mod_folder');
      
      if (selected) {
        setFormData(prev => ({ ...prev, filePath: selected }));
        
        // Auto-generate title from folder name if not set
        if (!formData.title) {
          const foldername = selected.split('/').pop() || '';
          setFormData(prev => ({ ...prev, title: foldername }));
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
        description: formData.description.trim() || undefined
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Install New Mod</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Folder Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mod Folder
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.filePath ? formData.filePath.split('/').pop() : ''}
                placeholder="No folder selected"
                readOnly
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleFolderSelect}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Browse
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mod Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter mod title"
              disabled={loading}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Character */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Character (Optional)
            </label>
            <select
              value={formData.character}
              onChange={(e) => setFormData(prev => ({ ...prev, character: e.target.value }))}
              disabled={loading}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">No specific character</option>
              {characters.map(char => (
                <option key={char.id} value={char.id}>
                  {char.icon} {char.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail URL (Optional)
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            {formData.thumbnail && (
              <div className="mt-2">
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter mod description"
              rows={3}
              disabled={loading}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.filePath}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Installing...
                </>
              ) : (
                "Install Mod"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModInstallDialog;
