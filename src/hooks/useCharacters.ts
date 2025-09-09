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
    { id: 'belle', name: 'Belle', icon: '👩‍🦰' },
    { id: 'wise', name: 'Wise', icon: '👨‍💼' },
    { id: 'nicole', name: 'Nicole', icon: '👩‍💻' },
    { id: 'anby', name: 'Anby', icon: '⚡' },
    { id: 'billy', name: 'Billy', icon: '🤖' },
    { id: 'nekomiya', name: 'Nekomiya', icon: '🐱' },
    { id: 'corin', name: 'Corin', icon: '🧹' },
    { id: 'anton', name: 'Anton', icon: '🔧' },
    { id: 'ben', name: 'Ben', icon: '🐻' },
    { id: 'koleda', name: 'Koleda', icon: '🔥' },
    { id: 'lycaon', name: 'Lycaon', icon: '🐺' },
    { id: 'rina', name: 'Rina', icon: '⚡' },
    { id: 'soldier11', name: 'Soldier 11', icon: '🔫' },
    { id: 'grace', name: 'Grace', icon: '⚡' },
    { id: 'ellen', name: 'Ellen', icon: '❄️' },
    { id: 'zhu_yuan', name: 'Zhu Yuan', icon: '👮‍♀️' },
    { id: 'qingyi', name: 'Qingyi', icon: '🤖' },
    { id: 'jane', name: 'Jane', icon: '🕷️' },
    { id: 'seth', name: 'Seth', icon: '🛡️' },
    { id: 'caesar', name: 'Caesar', icon: '👑' },
    { id: 'burnice', name: 'Burnice', icon: '🔥' },
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
