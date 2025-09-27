import React, { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";
import { FiFolder, FiSave, FiRefreshCw, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { cnButton } from "../styles/buttons";

interface SettingsState {
  zzmiModsPath: string;
  autoStart: boolean;
  notifications: boolean;
  theme: string;
}

const SettingsPage: React.FC = () => {
  const { settings, loading, updateSettings, selectFolder } = useSettings();
  const [localSettings, setLocalSettings] = useState<SettingsState>({
    zzmiModsPath: "",
    autoStart: false,
    notifications: true,
    theme: "dark",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Update local settings when settings from hook change
  useEffect(() => {
    if (!loading && settings) {
      setLocalSettings((prev) => ({
        ...prev,
        zzmiModsPath: settings.zzmiModsPath || "",
      }));
    }
  }, [settings, loading]);

  const handleZzmiPathChange = (path: string) => {
    setLocalSettings((prev) => ({ ...prev, zzmiModsPath: path }));
  };

  const handleBrowseZzmiFolder = async () => {
    const path = await selectFolder(
      "Select ZZMI Mods Folder",
      localSettings.zzmiModsPath || undefined
    );
    if (path) {
      // Update local input immediately
      handleZzmiPathChange(path);
      // Auto-save to avoid confusion on Windows where users expect the selection to persist
      setSaving(true);
      setMessage(null);
      try {
        const success = await updateSettings({ zzmiModsPath: path });
        setMessage({
          text: success ? "Mods folder saved." : "Failed to save selected folder",
          type: success ? "success" : "error",
        });
      } catch (err) {
        setMessage({ text: "An error occurred while saving folder", type: "error" });
      } finally {
        setSaving(false);
        setTimeout(() => setMessage(null), 4000);
      }
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const success = await updateSettings({
        zzmiModsPath: localSettings.zzmiModsPath,
      });

      setMessage({
        text: success
          ? "Settings saved successfully!"
          : "Failed to save settings",
        type: success ? "success" : "error",
      });
    } catch (err) {
      setMessage({
        text: "An error occurred while saving settings",
        type: "error",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleResetSettings = () => {
    setLocalSettings({
      zzmiModsPath: "",
      autoStart: false,
      notifications: true,
      theme: "dark",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--moon-accent)]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Settings</h1>
        <p className="text-lg text-[var(--moon-muted)]">
          Customize your Ether Manager experience
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl backdrop-blur-md border ${
            message.type === "success"
              ? "bg-green-900/30 border-green-500/30"
              : "bg-red-900/30 border-red-500/30"
          } shadow-lg transform transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-center animate-fade-in">
            <div
              className={`p-1.5 rounded-full mr-3 ${
                message.type === "success"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <FiCheckCircle className="h-5 w-5" />
              ) : (
                <FiAlertCircle className="h-5 w-5" />
              )}
            </div>
            <span className="text-[var(--moon-text)]">{message.text}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Path Settings */}
        <div className="bg-[var(--moon-surface)] rounded-xl p-6 border border-[var(--moon-border)]">
          <h2 className="text-xl font-semibold text-[var(--moon-text)] mb-5 flex items-center">
            <FiFolder className="mr-3 text-[var(--moon-glow-violet)]" />
            Mods Directory
          </h2>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="zzmiModsPath"
                className="block text-sm font-medium text-[var(--moon-muted)] mb-2"
              >
                ZZZ Mods Folder
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="zzmiModsPath"
                  value={localSettings.zzmiModsPath}
                  onChange={(e) => handleZzmiPathChange(e.target.value)}
                  placeholder="Select your ZZZ mods folder..."
                  className="flex-1 px-4 py-2.5 bg-[var(--moon-bg)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--moon-glow-violet)] focus:border-transparent transition-colors"
                />
                <button
                  onClick={handleBrowseZzmiFolder}
                  className={cnButton({ variant: 'primary', size: 'md', className: 'whitespace-nowrap' })}
                >
                  <FiFolder className="w-4 h-4" />
                  Browse
                </button>
              </div>
              <p className="mt-2 text-sm text-[var(--moon-muted)]">
                This is where your ZZZ mods are installed. Usually located in
                your ZZZ game directory.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            onClick={handleResetSettings}
            className={cnButton({ variant: 'secondary', size: 'lg', className: 'flex-1 sm:flex-none' })}
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={cnButton({ variant: 'primary', size: 'xl', className: 'flex items-center space-x-2', disabled: saving })}
          >
            {saving ? (
              <>
                <FiRefreshCw className="animate-spin w-4 h-4" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
