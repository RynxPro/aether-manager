import React, { useState } from "react";

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    modsFolderPath: "",
    autoStart: false,
    notifications: true,
    theme: "dark",
  });

  const handleModsFolderChange = (path: string) => {
    setSettings((prev) => ({ ...prev, modsFolderPath: path }));
  };

  const handleBrowseFolder = () => {
    console.log("Open folder browser");
    // Will be implemented with Tauri file dialog
  };

  const handleSaveSettings = () => {
    console.log("Save settings:", settings);
    // Will be implemented with actual settings persistence
  };

  const handleResetSettings = () => {
    setSettings({
      modsFolderPath: "",
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
        {/* Mods Folder Path */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Mods Folder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ZZZ Mods Folder Path
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={settings.modsFolderPath}
                  onChange={(e) => handleModsFolderChange(e.target.value)}
                  placeholder="C:\Games\ZenlessZoneZero\zzmi\mods"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleBrowseFolder}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Browse
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Path to your Zenless Zone Zero mods folder (zzmi/mods)
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
                  Launch Ether Manager when Windows starts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoStart}
                  onChange={(e) =>
                    setSettings((prev) => ({
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
                  checked={settings.notifications}
                  onChange={(e) =>
                    setSettings((prev) => ({
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
                value={settings.theme}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, theme: e.target.value }))
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
              <span className="text-gray-300">Author:</span> Ether Manager Team
            </p>
            <p>
              <span className="text-gray-300">Description:</span> Mod manager
              for Zenless Zone Zero
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Save Settings
          </button>
          <button
            onClick={handleResetSettings}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
