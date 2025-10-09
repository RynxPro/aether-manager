import React, { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";
import {
  FiFolder,
  FiSave,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { cnButton } from "../styles/buttons";

const SettingsPage: React.FC = () => {
  const { settings, loading, updateSettings, selectFolder } = useSettings();
  const [zzmiModsPath, setZzmiModsPath] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Initialize from settings
  useEffect(() => {
    if (!loading && settings?.zzmiModsPath) {
      setZzmiModsPath(settings.zzmiModsPath);
    }
  }, [settings, loading]);

  const handleBrowseZzmiFolder = async () => {
    try {
      const path = await selectFolder("Select ZZMI Mods Folder");
      console.log("Selected path:", path);
      if (path) {
        setZzmiModsPath(path);
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
      setMessage({
        text: "Failed to select folder. Please try again.",
        type: "error",
      });
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const success = await updateSettings({
        zzmiModsPath: zzmiModsPath,
      });

      setMessage({
        text: success
          ? "Settings saved successfully!"
          : "Failed to save settings",
        type: success ? "success" : "error",
      });
    } catch (err) {
      console.error("Error saving settings:", err);
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
    setZzmiModsPath("");
    // Reset other settings if needed
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
                ZZMI Mods Folder
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="zzmiModsPath"
                  value={zzmiModsPath}
                  onChange={(e) => setZzmiModsPath(e.target.value)}
                  placeholder="Select your ZZZ mods folder..."
                  className="flex-1 px-4 py-2.5 bg-[var(--moon-bg)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--moon-glow-violet)] focus:border-transparent transition-colors"
                />
                <button
                  onClick={handleBrowseZzmiFolder}
                  className={cnButton({
                    variant: "primary",
                    size: "md",
                    className: "whitespace-nowrap",
                  })}
                >
                  <FiFolder className="w-4 h-4" />
                  Browse
                </button>
              </div>
              <p className="mt-2 text-sm text-[var(--moon-muted)]">
                This is where your ZZZ mods are installed. Usually located in
                your ZZMI directory.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            onClick={handleResetSettings}
            className={cnButton({
              variant: "secondary",
              size: "lg",
              className: "flex-1 sm:flex-none",
            })}
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={cnButton({
              variant: "primary",
              size: "xl",
              className: "flex items-center space-x-2",
              disabled: saving,
            })}
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
