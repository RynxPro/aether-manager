import { useMods, Mod } from "./useMods";

export interface Character {
  id: string;
  name: string;
  // URL to the character icon image loaded from assets/characters
  iconUrl?: string;
  // Deprecated: legacy emoji icon kept for backward compatibility
  icon?: string;
  installedMods: number;
  activeMods: number;
}

export const useCharacters = () => {
  const { mods, loading, error } = useMods();

  // Import all character images as URLs (Vite)
  const characterImages = import.meta.glob("../assets/characters/*", {
    eager: true,
    as: "url",
  }) as Record<string, string>;

  const getIconUrl = (id: string): string | undefined => {
    // Files are named like alice_r.jpeg, soldier11_r.jpeg, etc.
    const suffix = `${id}_r.jpeg`;
    const entry = Object.entries(characterImages).find(([path]) =>
      path.endsWith(suffix)
    );
    return entry ? entry[1] : undefined;
  };

  // Define available characters
  const availableCharacters = [
    { id: "alice", name: "Alice" },
    { id: "anby", name: "Anby" },
    { id: "anbys0", name: "Anby S0" },
    { id: "anton", name: "Anton" },
    { id: "astra", name: "Astra" },
    { id: "belle", name: "Belle" },
    { id: "ben", name: "Ben" },
    { id: "billy", name: "Billy" },
    { id: "burnice", name: "Burnice" },
    { id: "caesar", name: "Caesar" },
    { id: "corin", name: "Corin" },
    { id: "ellen", name: "Ellen" },
    { id: "evelyn", name: "Evelyn" },
    { id: "grace", name: "Grace" },
    { id: "harumasa", name: "Harumasa" },
    { id: "hugo", name: "Hugo" },
    { id: "jane", name: "Jane" },
    { id: "jufufu", name: "Jufufu" },
    { id: "koleda", name: "Koleda" },
    { id: "lighter", name: "Lighter" },
    { id: "lucy", name: "Lucy" },
    { id: "lycaon", name: "Lycaon" },
    { id: "miyabi", name: "Miyabi" },
    { id: "nekomata", name: "Nekomata" },
    { id: "nicole", name: "Nicole" },
    { id: "pan", name: "Pan" },
    { id: "piper", name: "Piper" },
    { id: "pulchra", name: "Pulchra" },
    { id: "qingyi", name: "Qingyi" },
    { id: "rina", name: "Rina" },
    { id: "seed", name: "Seed" },
    { id: "seth", name: "Seth" },
    { id: "soldier11", name: "Soldier 11" },
    { id: "soukaku", name: "Soukaku" },
    { id: "trigger", name: "Trigger" },
    { id: "vivian", name: "Vivian" },
    { id: "wise", name: "Wise" },
    { id: "yanagi", name: "Yanagi" },
    { id: "yixuan", name: "Yixuan" },
    { id: "yuzuha", name: "Yuzuha" },
    { id: "zhuyuan", name: "Zhu Yuan" },
  ];

  const getCharacterMods = (characterId: string): Mod[] => {
    return mods.filter((mod) => mod.character === characterId);
  };

  const characters: Character[] = availableCharacters.map((char) => {
    const characterMods = getCharacterMods(char.id);
    return {
      ...char,
      iconUrl: getIconUrl(char.id),
      installedMods: characterMods.length,
      activeMods: characterMods.filter((mod) => mod.isActive).length,
    };
  });

  const getOtherMods = (): Mod[] => {
    return mods.filter((mod) => !mod.character || mod.character === "");
  };

  return {
    characters,
    loading,
    error,
    getCharacterMods,
    getOtherMods,
  };
};
