import React, { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";

const SettingsPage: React.FC = () => {
  const { settings, loading, error, updateSettings, selectFolder } = useSettings();
  const [localSettings, setLocalSettings] = useState({
    zzmiModsPath: "",
    autoStart: false,
    notifications: true,
    theme: "dark",
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Update local settings when settings from hook change
  useEffect(() => {
    setLocalSettings(prev => ({
      ...prev,
      zzmiModsPath: settings.zzmiModsPath || "",
    }));
  }, [settings]);

  const handleZzmiPathChange = (path: string) => {
    setLocalSettings((prev) => ({ ...prev, zzmiModsPath: path }));
  };

  const handleBrowseZzmiFolder = async () => {
    const path = await selectFolder("Select ZZMI Mods Folder");
    if (path) {
      handleZzmiPathChange(path);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveMessage(null);
    
    const success = await updateSettings({
      zzmiModsPath: localSettings.zzmiModsPath,
    });
    
    setSaving(false);
    setSaveMessage(success ? "Settings saved successfully!" : "Failed to save settings.");
    
    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleResetSettings = () => {
    setLocalSettings({
      zzmiModsPath: "",
      autoStart: false,
      notifications: true,
      theme: "dark",
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your mod manager preferences</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Game Configuration */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Game Configuration</h2>
          <div className="space-y-6">
            {/* App Data Info */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Mod Storage</h3>
              <p className="text-xs text-gray-400">
                Mods are automatically stored in the app's managed folder. No configuration needed.
              </p>
            </div>

            {/* ZZMI Mods Path */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ZZMI Mods Folder (Optional)
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={localSettings.zzmiModsPath}
                  onChange={(e) => handleZzmiPathChange(e.target.value)}
                  placeholder="C:\Games\ZenlessZoneZero\zzmi\mods"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleBrowseZzmiFolder}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Browse
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Set this to automatically copy active mods to your game's zzmi/mods folder
              </p>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            App Preferences
          </h2>
          <div className="space-y-4">
            {/* Auto Start */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Start with Windows
                </label>
                <p className="text-xs text-gray-500">
                  Launch Aether Manager when Windows starts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoStart}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      autoStart: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Notifications
                </label>
                <p className="text-xs text-gray-500">
                  Show notifications for mod operations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.notifications}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      notifications: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme
              </label>
              <select
                value={localSettings.theme}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, theme: e.target.value }))
                }
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">About</h2>
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              <span className="text-gray-300">Version:</span> 1.0.0
            </p>
            <p>
              <span className="text-gray-300">Author:</span> Aether Manager Team
            </p>
            <p>
              <span className="text-gray-300">Description:</span> Mod manager
              for Zenless Zone Zero
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {saveMessage && (
          <div className={`border rounded-lg p-4 ${
            saveMessage.includes('success') 
              ? 'bg-green-600/20 border-green-600/30 text-green-400' 
              : 'bg-red-600/20 border-red-600/30 text-red-400'
          }`}>
            <p className="text-sm">{saveMessage}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSaveSettings}
            disabled={saving || loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
          <button
            onClick={handleResetSettings}
            disabled={saving || loading}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
