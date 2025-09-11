import React from "react";

export interface CharacterCardProps {
  character: {
    id: string;
    name: string;
    iconUrl?: string;
    icon?: string;
    installedMods: number;
    activeMods: number;
    description?: string;
  };
  onClick?: (id: string) => void;
  className?: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
  className = "",
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(character.id);
    }
  };

  return (
    <div
      className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer group bg-[var(--moon-surface)] backdrop-blur-sm border border-[var(--moon-border)] hover:border-[var(--moon-glow-violet)] hover:shadow-[0_0_12px_var(--moon-glow-violet)] h-full w-full ${className}`}
      onClick={handleClick}
    >
      {/* Character Portrait */}
      <div className="relative mb-2 sm:mb-3 w-full aspect-square max-w-[80px] mx-auto">
        <div className="w-full h-full bg-[var(--moon-bg)] rounded-full flex items-center justify-center overflow-hidden border-2 border-[var(--moon-glow-violet)] group-hover:border-[var(--moon-accent)] transition-colors">
          {character.iconUrl ? (
            <img
              src={character.iconUrl}
              alt={character.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
          ) : (
            <span className="text-2xl">{character.icon || "👤"}</span>
          )}
        </div>

        {/* Status indicators */}
        <div className="absolute -bottom-1 -right-1 flex space-x-1">
          {character.installedMods > 0 && (
            <div
              className="w-3 h-3 bg-[var(--moon-accent)] rounded-full border border-[var(--moon-border)]"
              title={`${character.installedMods} mods installed`}
            />
          )}
          {character.activeMods > 0 && (
            <div
              className="w-3 h-3 bg-[var(--moon-on)] rounded-full border border-[var(--moon-border)]"
              title={`${character.activeMods} active mods`}
            />
          )}
        </div>
      </div>

      {/* Character Name */}
      <h3 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2 text-center text-[var(--moon-text)] group-hover:text-[var(--moon-glow-violet)] transition-colors line-clamp-1 px-1 w-full">
        {character.name}
      </h3>

      {/* Stats */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xs text-gray-400 w-full">
        <div className="flex items-center space-x-1" title="Total mods">
          <span>{character.installedMods}</span>
          <span>Total</span>
        </div>
        <div className="flex items-center space-x-1" title="Active mods">
          <span>{character.activeMods}</span>
          <span>Active</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
