import React, { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";
import {
  FiFolder,
  FiSave,
  FiRefreshCw,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

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
    const path = await selectFolder("Select ZZMI Mods Folder");
    if (path) {
      handleZzmiPathChange(path);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center mb-2">
        <div className="bg-gradient-to-br from-purple-500/30 to-blue-600/30 p-2.5 rounded-xl mr-3">
          <svg
            className="w-8 h-8 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-600 bg-clip-text text-transparent">
          Settings
        </h1>
      </div>
      <p className="text-gray-300 ml-11">
        Customize your Aether Manager experience
      </p>

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
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Game Path Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-purple-500/40 shadow-xl">
          <div className="p-6">
            <div className="flex items-start mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-600/20 text-purple-300 mr-4 mt-0.5">
                <FiFolder className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent shadow-inner">
                  Game Paths
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Configure where your game and mods are located on your system
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Mod Storage Info */}
              <div className="bg-gradient-to-r from-purple-500/5 to-blue-600/10 rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm">
                <div className="flex items-start">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-600/20 text-purple-300 mr-3 mt-0.5 flex-shrink-0">
                    <FiInfo className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-purple-300 mb-1 bg-gradient-to-r from-purple-300 to-blue-400 bg-clip-text text-transparent shadow-inner">
                      Mod Storage
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Mods are automatically organized in the app's managed
                      folder.
                      <span className="text-purple-300 font-medium">
                        No configuration needed
                      </span>{" "}
                      for storage location.
                    </p>
                  </div>
                </div>
              </div>

              {/* ZZMI Mods Path */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-200 flex items-center">
                    <span className="bg-gradient-to-r from-purple-500/10 to-blue-600/10 text-purple-300 text-xs px-2 py-0.5 rounded-full mr-2">
                      RECOMMENDED
                    </span>
                    ZZMI Mods Folder
                  </label>
                  <span className="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-full">
                    Optional
                  </span>
                </div>

                <div className="flex space-x-3">
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      value={localSettings.zzmiModsPath}
                      onChange={(e) => handleZzmiPathChange(e.target.value)}
                      placeholder="C:\\Games\\ZenlessZoneZero\\zzmi\\mods"
                      className="w-full px-5 py-3.5 bg-gray-700/30 border border-gray-600/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-blue-500/40 transition-all duration-200 backdrop-blur-sm group-hover:border-gray-500/50"
                    />
                    {localSettings.zzmiModsPath && (
                      <button
                        onClick={() => handleZzmiPathChange("")}
                        className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-600/30 transition-colors"
                        aria-label="Clear path"
                      >
                        <svg
                          className="h-4 w-4"
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
                    )}
                  </div>
                  <button
                    onClick={handleBrowseZzmiFolder}
                    className="btn-primary px-4 py-3 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center shadow-lg shadow-purple-600/40 hover:shadow-blue-700/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    disabled={saving}
                  >
                    <FiFolder className="h-4 w-4 mr-1.5" />
                    <span>Browse</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-blue-600 mr-1.5"></span>
                  Set this to your game's zzmi/mods folder to enable one-click
                  mod activation
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-gray-800/30 to-gray-800/10 px-6 py-5 border-t border-gray-700/30 flex justify-end space-x-3 backdrop-blur-sm">
            <button
              onClick={handleResetSettings}
              disabled={saving}
              className="btn-secondary px-6 py-3 text-sm font-medium text-gray-300 hover:text-white rounded-lg transition-all duration-200 border border-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center group"
            >
              <FiRefreshCw className="h-4 w-4 mr-1.5 transition-transform group-hover:rotate-180 duration-500" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="btn-primary px-6 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center shadow-lg shadow-purple-600/50 hover:shadow-blue-700/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none group"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="h-4 w-4 mr-1.5 transition-transform group-hover:scale-110" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
