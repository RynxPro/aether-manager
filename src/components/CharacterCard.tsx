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
      className={`flex flex-col items-center p-3 sm:p-4 rounded-xl transition-all duration-200 cursor-pointer group bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-900/50 h-full w-full ${className}`}
      onClick={handleClick}
    >
      {/* Character Portrait */}
      <div className="relative mb-2 sm:mb-3 w-full aspect-square max-w-[80px] mx-auto">
        <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center overflow-hidden group-hover:bg-gray-600 transition-colors border-2 border-gray-600">
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
      <h3 className="text-white font-medium text-xs sm:text-sm mb-1 sm:mb-2 text-center group-hover:text-blue-400 transition-colors line-clamp-1 px-1 w-full">
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
