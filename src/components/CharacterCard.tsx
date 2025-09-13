import React, { useCallback, useMemo } from 'react';
import { Character } from '@/types/character';

// Import all icons directly
import auricInkIcon from '@/assets/attributes/Icon_Auric_Ink.webp';
import electricIcon from '@/assets/attributes/Icon_Electric.webp';
import etherIcon from '@/assets/attributes/Icon_Ether.webp';
import fireIcon from '@/assets/attributes/Icon_Fire.webp';
import frostIcon from '@/assets/attributes/Icon_Frost.webp';
import iceIcon from '@/assets/attributes/Icon_Ice.webp';
import physicalIcon from '@/assets/attributes/Icon_Physical.webp';
import rankAIcon from '@/assets/ranks/Icon_AgentRank_A.webp';
import rankSIcon from '@/assets/ranks/Icon_AgentRank_S-2.webp';
import attackIcon from '@/assets/specialty/Icon_Attack.webp';
import defenseIcon from '@/assets/specialty/Icon_Defense.webp';
import supportIcon from '@/assets/specialty/Icon_Support.webp';
import anomalyIcon from '@/assets/specialty/Icon_Anomaly.webp';

type AttributeKey = 'auric_ink' | 'electric' | 'ether' | 'fire' | 'frost' | 'ice' | 'physical';
type RankKey = 'A' | 'S';
type SpecialtyKey = 'attack' | 'defense' | 'support' | 'anomaly' | 'rupture' | 'stun' | 'balanced';

const ICONS = {
  attributes: {
    auric_ink: auricInkIcon,
    electric: electricIcon,
    ether: etherIcon,
    fire: fireIcon,
    frost: frostIcon,
    ice: iceIcon,
    physical: physicalIcon,
  } as const,
  ranks: {
    A: rankAIcon,
    S: rankSIcon,
  } as const,
  specialties: {
    attack: attackIcon,
    defense: defenseIcon,
    support: supportIcon,
    anomaly: anomalyIcon,
    rupture: anomalyIcon,
    stun: anomalyIcon,
    balanced: anomalyIcon,
  } as const,
};

export interface CharacterCardProps {
  character: Character;
  onClick?: (id: string) => void;
  className?: string;
  hideAttributesFor?: string[];
}

const StatBadge: React.FC<{ value: number; label: string; isActive?: boolean }> = ({
  value,
  label,
  isActive = false,
}) => (
  <div
    className="flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-[var(--moon-surface)] 
               border border-[var(--moon-border)] text-[var(--moon-muted)] text-[0.7rem]"
    title={`${label} mods`}
  >
    <span className={`font-semibold ${isActive ? 'text-[var(--moon-on)]' : 'text-[var(--moon-text)]'}`}>
      {value}
    </span>
    <span>{label}</span>
  </div>
);

const IconWithTooltip: React.FC<{ src: string; alt: string; title: string }> = ({
  src,
  alt,
  title,
}) => (
  <div className="w-5 h-5 bg-transparent" title={title}>
    <img src={src} alt={alt} className="w-full h-full object-contain" />
  </div>
);

const CharacterPortrait: React.FC<{ character: Character }> = ({ character }) => (
  <div className="relative mb-1 w-full aspect-square max-w-[70px] mx-auto">
    <div className="w-full h-full bg-[var(--moon-bg)] rounded-full flex items-center justify-center 
                  overflow-hidden border-2 border-[var(--moon-glow-violet)] 
                  group-hover:border-[var(--moon-accent)] transition-colors">
      {character.iconUrl ? (
        <img
          src={character.iconUrl}
          alt={character.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span className="text-2xl">{character.icon || '👤'}</span>
      )}
    </div>
  </div>
);

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
  className = '',
  hideAttributesFor = ['belle', 'wise'],
}) => {
  const shouldShowAttributes = useMemo(
    () => !hideAttributesFor.includes(character.id.toLowerCase()),
    [character.id, hideAttributesFor]
  );

  const handleClick = useCallback(() => {
    onClick?.(character.id);
  }, [onClick, character.id]);

  return (
    <div
      className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 cursor-pointer 
                 group bg-[var(--moon-surface)] backdrop-blur-sm border border-[var(--moon-border)] 
                 hover:border-[var(--moon-glow-violet)] hover:shadow-[0_0_12px_var(--moon-glow-violet)] 
                 h-full w-full min-w-[120px] flex-shrink-0 ${className}`}
      style={{ flex: '0 0 auto' }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <CharacterPortrait character={character} />

      <div className="w-full flex flex-col items-center">
        <h3 className="font-medium text-xs sm:text-sm mb-2 text-center text-[var(--moon-text)] 
                      group-hover:text-[var(--moon-glow-violet)] transition-colors line-clamp-1 px-1 w-full">
          {character.name}
        </h3>

        {shouldShowAttributes && (
          <div className="flex items-center justify-center space-x-1.5 mb-1">
            {character.attribute && ICONS.attributes[character.attribute as AttributeKey] && (
              <IconWithTooltip
                src={ICONS.attributes[character.attribute as AttributeKey]}
                alt={character.attribute}
                title={character.attribute}
              />
            )}

            {character.rank && ICONS.ranks[character.rank as RankKey] && (
              <IconWithTooltip
                src={ICONS.ranks[character.rank as RankKey]}
                alt={`Rank ${character.rank}`}
                title={`Rank ${character.rank}`}
              />
            )}

            {character.specialty && ICONS.specialties[character.specialty as SpecialtyKey] && (
              <IconWithTooltip
                src={ICONS.specialties[character.specialty as SpecialtyKey]}
                alt={character.specialty}
                title={character.specialty}
              />
            )}
          </div>
        )}
      </div>

      <div className={`flex items-center justify-center space-x-2 text-xs w-full ${shouldShowAttributes ? 'mt-1.5' : 'mt-7'}`}>
        <StatBadge value={character.installedMods} label="Total" />
        <StatBadge value={character.activeMods} label="Active" isActive />
      </div>
    </div>
  );
};

export default React.memo(CharacterCard);
