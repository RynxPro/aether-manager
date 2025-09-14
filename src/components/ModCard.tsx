import React, { useCallback, useMemo } from "react";
import { Mod } from "@/types/mod";
import { cnButton } from "@/styles/buttons";
import ConfirmDialog from "./ConfirmDialog";

// SVG Icons
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg
    className="w-8 h-8 text-[var(--moon-muted)]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

const EyeIcon = ({ open = true }) => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {open ? (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </>
    ) : (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
        />
      </>
    )}
  </svg>
);

interface ModCardProps {
  mod: Mod;
  onDelete: (modId: string) => void;
  onViewDetails?: (modId: string) => void;
}

const ModThumbnail: React.FC<{ thumbnail?: string; alt: string }> = ({
  thumbnail,
  alt,
}) => {
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231a1e2c'/%3E%3Cpath d='M30,40 L70,40 L70,60 L30,60 Z' fill='%232a3145'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='12'%3ENo Preview%3C/text%3E%3C/svg%3E";
    },
    []
  );

  if (thumbnail) {
    return (
      <div className="w-full h-40 overflow-hidden">
        <img
          src={thumbnail}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-[var(--moon-bg)] to-[#0f1320]">
      <div className="text-center p-4">
        <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-[var(--moon-surface)] flex items-center justify-center">
          <ImagePlaceholderIcon />
        </div>
        <span className="text-xs text-[var(--moon-muted)]">
          No preview available
        </span>
      </div>
    </div>
  );
};

const DeleteButton: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cnButton({
      variant: "ghost",
      size: "sm",
      className: "hover:bg-red-500/10 hover:text-red-400",
    })}
    aria-label="Delete mod"
    title="Delete mod"
  >
    <DeleteIcon />
  </button>
);

const ToggleButton: React.FC<{
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}> = ({ isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center w-16 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--moon-glow-violet)] focus:ring-offset-2 focus:ring-offset-[var(--moon-bg)] ${
        isActive
          ? "bg-[var(--moon-accent)] shadow-[0_0_12px_-2px_var(--moon-accent)]"
          : "bg-[var(--moon-surface)] border border-[var(--moon-border)] hover:border-[var(--moon-glow-violet)]/50"
      }`}
      aria-label={isActive ? "Deactivate mod" : "Activate mod"}
      title={isActive ? "Deactivate mod" : "Activate mod"}
    >
      <div
        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out ${
          isActive ? "translate-x-8" : "translate-x-0"
        }`}
      >
        <EyeIcon open={isActive} />
      </div>
    </button>
  );
};

const ModCard: React.FC<ModCardProps> = ({
  mod,
  onDelete,
  onViewDetails,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete(mod.id);
    setShowDeleteConfirm(false);
  }, [mod.id, onDelete]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const handleCardClick = useCallback(() => {
    onViewDetails?.(mod.id);
  }, [mod.id, onViewDetails]);

  const formattedDate = useMemo(() => {
    return new Date(mod.dateAdded).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [mod.dateAdded]);

  return (
    <>
      <div
        className="bg-[var(--moon-surface)] backdrop-blur-sm rounded-xl border border-[var(--moon-border)] overflow-hidden group flex flex-col h-full w-full min-w-[280px] max-w-[320px] flex-shrink-0 hover:border-[var(--moon-glow-violet)] hover:shadow-[0_0_15px_rgba(122,90,248,0.2)] transition-all duration-300 cursor-pointer"
        style={{ flex: "0 0 auto" }}
        onClick={handleCardClick}
      >
        <div className="relative h-40 bg-gray-900/20 overflow-hidden">
          <ModThumbnail thumbnail={mod.thumbnail} alt={mod.title} />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="text-[var(--moon-text)] font-medium text-sm mb-1.5 line-clamp-2 group-hover:text-[var(--moon-glow-violet)] transition-colors duration-200"
              title={mod.title}
            >
              {mod.title}
            </h3>
            <DeleteButton onClick={handleDeleteClick} />
          </div>

          {mod.character && (
            <div className="flex items-center text-xs text-[var(--moon-muted)] mb-3">
              <span className="truncate">{mod.character}</span>
            </div>
          )}

          <div className="mt-auto pt-3 flex items-center justify-between border-t border-[var(--moon-border)]">
            <span className="text-xs text-[var(--moon-muted)]">
              {formattedDate}
            </span>
            <ToggleButton
              isActive={mod.isActive}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Mod"
        message={`Are you sure you want to delete "${mod.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default React.memo(ModCard);
