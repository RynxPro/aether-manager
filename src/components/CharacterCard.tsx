import React from "react";

// Import attribute icons
import auricInkIcon from "../assets/attributes/Icon_Auric_Ink.webp";
import electricIcon from "../assets/attributes/Icon_Electric.webp";
import etherIcon from "../assets/attributes/Icon_Ether.webp";
import fireIcon from "../assets/attributes/Icon_Fire.webp";
import frostIcon from "../assets/attributes/Icon_Frost.webp";
import iceIcon from "../assets/attributes/Icon_Ice.webp";
import physicalIcon from "../assets/attributes/Icon_Physical.webp";

// Import rank icons
import rankAIcon from "../assets/ranks/Icon_AgentRank_A.webp";
import rankSIcon from "../assets/ranks/Icon_AgentRank_S-2.webp";

// Import specialty icons
import attackIcon from "../assets/specialty/Icon_Attack.webp";
import defenseIcon from "../assets/specialty/Icon_Defense.webp";
import supportIcon from "../assets/specialty/Icon_Support.webp";
import anomalyIcon from "../assets/specialty/Icon_Anomaly.webp";

// Map attributes to their corresponding icons
const attributeIcons: Record<string, string> = {
  auric_ink: auricInkIcon,
  electric: electricIcon,
  ether: etherIcon,
  fire: fireIcon,
  frost: frostIcon,
  ice: iceIcon,
  physical: physicalIcon,
};

// Map ranks to their corresponding icons
const rankIcons: Record<string, string> = {
  A: rankAIcon,
  S: rankSIcon,
};

// Map specialties to their corresponding icons
const specialtyIcons: Record<string, string> = {
  attack: attackIcon,
  defense: defenseIcon,
  support: supportIcon,
  anomaly: anomalyIcon,
  rupture: anomalyIcon,
  stun: anomalyIcon,
  balanced: anomalyIcon, // Using anomaly icon as a fallback for balanced
};

export interface CharacterCardProps {
  character: {
    id: string;
    name: string;
    iconUrl?: string;
    icon?: string;
    installedMods: number;
    activeMods: number;
    description?: string;
    attribute: string;
    rank: string;
    specialty: string;
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
      className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 cursor-pointer group bg-[var(--moon-surface)] backdrop-blur-sm border border-[var(--moon-border)] hover:border-[var(--moon-glow-violet)] hover:shadow-[0_0_12px_var(--moon-glow-violet)] h-full w-full min-w-[120px] flex-shrink-0 ${className}`}
      style={{ flex: '0 0 auto' }}
      onClick={handleClick}
    >
      {/* Character Portrait */}
      <div className="relative mb-1 w-full aspect-square max-w-[70px] mx-auto">
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

        {/* Status indicators removed as per request */}
      </div>

      {/* Character Name and Icons */}
      <div className="w-full flex flex-col items-center">
        <h3 className="font-medium text-xs sm:text-sm mb-2 text-center text-[var(--moon-text)] group-hover:text-[var(--moon-glow-violet)] transition-colors line-clamp-1 px-1 w-full">
          {character.name}
        </h3>

        {/* Only show attributes if not Belle or Wise */}
        {!["belle", "wise"].includes(character.id.toLowerCase()) && (
          <div className="flex items-center justify-center space-x-1.5 mb-1">
            {/* Attribute Icon */}
            {character.attribute && attributeIcons[character.attribute] && (
              <div
                className="w-5 h-5 bg-transparent"
                title={character.attribute}
              >
                <img
                  src={attributeIcons[character.attribute]}
                  alt={character.attribute}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Rank Icon */}
            {character.rank && rankIcons[character.rank] && (
              <div
                className="w-5 h-5 bg-transparent"
                title={`Rank ${character.rank}`}
              >
                <img
                  src={rankIcons[character.rank]}
                  alt={`Rank ${character.rank}`}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Specialty Icon */}
            {character.specialty && specialtyIcons[character.specialty] && (
              <div
                className="w-5 h-5 bg-transparent"
                title={character.specialty}
              >
                <img
                  src={specialtyIcons[character.specialty]}
                  alt={character.specialty}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div
        className={`flex items-center justify-center space-x-2 text-xs w-full ${
          !["belle", "wise"].includes(character.id.toLowerCase())
            ? "mt-1.5"
            : "mt-7"
        }`}
      >
        {/* Total Mods */}
        <div
          className="flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-[var(--moon-surface)] border border-[var(--moon-border)] text-[var(--moon-muted)] text-[0.7rem]"
          title="Total mods"
        >
          <span className="font-semibold text-[var(--moon-text)]">
            {character.installedMods}
          </span>
          <span>Total</span>
        </div>

        {/* Active Mods */}
        <div
          className="flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-[var(--moon-surface)] border border-[var(--moon-border)] text-[var(--moon-muted)] text-[0.7rem]"
          title="Active mods"
        >
          <span className="font-semibold text-[var(--moon-on)]">
            {character.activeMods}
          </span>
          <span>Active</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
