import { useMods, Mod } from './useMods';

export interface Character {
  id: string;
  name: string;
  icon: string;
  installedMods: number;
  activeMods: number;
}

export const useCharacters = () => {
  const { mods, loading, error } = useMods();

  // Define available characters
  const availableCharacters = [
    { id: 'alice', name: 'Alice', icon: '🎭' },
    { id: 'anby', name: 'Anby', icon: '⚡' },
    { id: 'anbys0', name: 'Anby S0', icon: '⚡' },
    { id: 'anton', name: 'Anton', icon: '🔧' },
    { id: 'astra', name: 'Astra', icon: '⭐' },
    { id: 'belle', name: 'Belle', icon: '👩‍🦰' },
    { id: 'ben', name: 'Ben', icon: '🐻' },
    { id: 'billy', name: 'Billy', icon: '🤖' },
    { id: 'burnice', name: 'Burnice', icon: '🔥' },
    { id: 'caesar', name: 'Caesar', icon: '👑' },
    { id: 'corin', name: 'Corin', icon: '🧹' },
    { id: 'ellen', name: 'Ellen', icon: '❄️' },
    { id: 'evelyn', name: 'Evelyn', icon: '🌸' },
    { id: 'grace', name: 'Grace', icon: '⚡' },
    { id: 'harumasa', name: 'Harumasa', icon: '🏹' },
    { id: 'hugo', name: 'Hugo', icon: '🎪' },
    { id: 'jane', name: 'Jane', icon: '🕷️' },
    { id: 'jufufu', name: 'Jufufu', icon: '🎭' },
    { id: 'koleda', name: 'Koleda', icon: '🔥' },
    { id: 'lighter', name: 'Lighter', icon: '🔥' },
    { id: 'lucy', name: 'Lucy', icon: '🐷' },
    { id: 'lycaon', name: 'Lycaon', icon: '🐺' },
    { id: 'miyabi', name: 'Miyabi', icon: '❄️' },
    { id: 'nekomata', name: 'Nekomata', icon: '🐱' },
    { id: 'nicole', name: 'Nicole', icon: '👩‍💻' },
    { id: 'pan', name: 'Pan', icon: '🍳' },
    { id: 'piper', name: 'Piper', icon: '🎵' },
    { id: 'pulchra', name: 'Pulchra', icon: '💎' },
    { id: 'qingyi', name: 'Qingyi', icon: '🤖' },
    { id: 'rina', name: 'Rina', icon: '⚡' },
    { id: 'seed', name: 'Seed', icon: '🌱' },
    { id: 'seth', name: 'Seth', icon: '🛡️' },
    { id: 'soldier11', name: 'Soldier 11', icon: '🔫' },
    { id: 'soukaku', name: 'Soukaku', icon: '❄️' },
    { id: 'trigger', name: 'Trigger', icon: '🎯' },
    { id: 'vivian', name: 'Vivian', icon: '🎨' },
    { id: 'wise', name: 'Wise', icon: '👨‍💼' },
    { id: 'yanagi', name: 'Yanagi', icon: '⚡' },
    { id: 'yixuan', name: 'Yixuan', icon: '🎭' },
    { id: 'yuzuha', name: 'Yuzuha', icon: '🌸' },
    { id: 'zhuyuan', name: 'Zhu Yuan', icon: '👮‍♀️' },
  ];

  const getCharacterMods = (characterId: string): Mod[] => {
    return mods.filter(mod => mod.character === characterId);
  };

  const characters: Character[] = availableCharacters.map(char => {
    const characterMods = getCharacterMods(char.id);
    return {
      ...char,
      installedMods: characterMods.length,
      activeMods: characterMods.filter(mod => mod.isActive).length,
    };
  });

  const getOtherMods = (): Mod[] => {
    return mods.filter(mod => !mod.character || mod.character === '');
  };

  return {
    characters,
    loading,
    error,
    getCharacterMods,
    getOtherMods,
  };
};
