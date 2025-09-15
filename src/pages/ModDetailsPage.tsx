import React, { useState, useEffect, useCallback } from "react";
import { useModsContext, useMod } from "@/context/ModsContext";
import { cnButton } from "@/styles/buttons";

interface ModDetailsPageProps {
  modId: string;
  onBack: () => void;
}

const ModDetailsPage: React.FC<ModDetailsPageProps> = ({ modId, onBack }) => {
  const { updateMod, toggleModActive } = useModsContext();
  const mod = useMod(modId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    description: "",
  });

  // Update form data when mod changes
  useEffect(() => {
    if (mod) {
      setFormData({
        title: mod.title,
        thumbnail: mod.thumbnail || "",
        description: mod.description || "",
      });
    }
  }, [mod]);

  const handleInputChange = useCallback(
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      },
    []
  );

  const handleSave = useCallback(async () => {
    if (!mod) return;

    try {
      await updateMod(mod.id, {
        title: formData.title,
        thumbnail: formData.thumbnail || undefined,
        description: formData.description || undefined,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update mod:", err);
    }
  }, [mod, formData, updateMod]);

  const handleCancel = useCallback(() => {
    if (mod) {
      setFormData({
        title: mod.title,
        thumbnail: mod.thumbnail || "",
        description: mod.description || "",
      });
    }
    setIsEditing(false);
  }, [mod]);

  const handleToggleActive = useCallback(async () => {
    if (!mod) return;
    try {
      await toggleModActive(mod.id);
    } catch (err) {
      console.error("Failed to toggle mod active state:", err);
    }
  }, [mod, toggleModActive]);

  if (!mod) {
    return (
      <div className="p-4">
        <div className="text-[var(--moon-text)]">Mod not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className={cnButton({
              variant: "ghost",
              size: "sm",
              className: "hover:bg-[var(--moon-surface)]",
            })}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-[var(--moon-text)]">
            Mod Details
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className={cnButton({
                variant: "primary",
                size: "sm",
              })}
            >
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className={cnButton({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={cnButton({
                  variant: "primary",
                  size: "sm",
                })}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Thumbnail Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--moon-text)]">
            Thumbnail
          </h2>
          <div className="aspect-video bg-[var(--moon-surface)] rounded-lg border border-[var(--moon-border)] overflow-hidden">
            {formData.thumbnail ? (
              <img
                src={formData.thumbnail}
                alt={formData.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231a1e2c'/%3E%3Cpath d='M30,40 L70,40 L70,60 L30,60 Z' fill='%232a3145'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='12'%3ENo Preview%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--moon-bg)] to-[#0f1320]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-[var(--moon-surface)] flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[var(--moon-muted)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-[var(--moon-muted)]">
                    No preview available
                  </span>
                </div>
              </div>
            )}
          </div>
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={handleInputChange("thumbnail")}
                placeholder="Enter thumbnail URL..."
                className="w-full px-3 py-2 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--moon-glow-violet)] focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
              Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.title}
                onChange={handleInputChange("title")}
                className="w-full px-3 py-2 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] focus:outline-none focus:ring-2 focus:ring-[var(--moon-glow-violet)] focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)]">
                {mod.title}
              </div>
            )}
          </div>

          {/* Character */}
          {mod.character && (
            <div>
              <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
                Character
              </label>
              <div className="px-3 py-2 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)]">
                {mod.character}
              </div>
            </div>
          )}

          {/* Mod URL */}
          <div>
            <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
              Mod URL
            </label>
            {isEditing ? (
              <input
                type="url"
                value={formData.description}
                onChange={handleInputChange("description")}
                placeholder="https://example.com/mod-page"
                className="w-full px-3 py-2 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] placeholder-[var(--moon-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--moon-glow-violet)] focus:border-transparent"
              />
            ) : (
              <div className="px-3 py-2 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)]">
                {mod.description ? (
                  <a 
                    href={mod.description} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[var(--moon-accent)] hover:underline break-all"
                  >
                    {mod.description}
                  </a>
                ) : (
                  <span className="text-[var(--moon-muted)]">No URL provided</span>
                )}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
              Status
            </label>
            <div className="flex items-center space-x-3">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mod.isActive
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {mod.isActive ? "Active" : "Inactive"}
              </div>
              <button
                onClick={handleToggleActive}
                className={cnButton({
                  variant: "ghost",
                  size: "sm",
                  className: "hover:bg-[var(--moon-surface)]",
                })}
              >
                {mod.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>

          {/* File Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
                Original File Name
              </label>
              <div className="px-3 py-2 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)] font-mono text-sm">
                {mod.originalName}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--moon-text)] mb-2">
                Date Added
              </label>
              <div className="px-3 py-2 bg-[var(--moon-surface)] border border-[var(--moon-border)] rounded-lg text-[var(--moon-text)]">
                {new Date(mod.dateAdded).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModDetailsPage;
