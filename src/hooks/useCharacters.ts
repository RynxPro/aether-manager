import { useMods, Mod } from "./useMods";

export type Attribute =
  | "physical"
  | "fire"
  | "ice"
  | "electric"
  | "ether"
  | "auric_ink"
  | "frost";
export type Rank = "A" | "S";
export type Specialty = "attack" | "defense" | "support" | "balanced";

export interface Character {
  id: string;
  name: string;
  // URL to the character icon image loaded from assets/characters
  iconUrl?: string;
  // Deprecated: legacy emoji icon kept for backward compatibility
  icon?: string;
  installedMods: number;
  activeMods: number;
  attribute: Attribute;
  rank: Rank;
  specialty: Specialty;
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

  // Define available characters with their attributes, ranks, and specialties
  const availableCharacters: Character[] = [
    {
      id: "alice",
      name: "Alice",
      attribute: "electric",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "anby",
      name: "Anby",
      attribute: "physical",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "anbys0",
      name: "Anby S0",
      attribute: "physical",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "anton",
      name: "Anton",
      attribute: "fire",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "astra",
      name: "Astra",
      attribute: "ether",
      rank: "S",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "belle",
      name: "Belle",
      attribute: "ice",
      rank: "A",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "ben",
      name: "Ben",
      attribute: "physical",
      rank: "A",
      specialty: "defense",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "billy",
      name: "Billy",
      attribute: "fire",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "burnice",
      name: "Burnice",
      attribute: "fire",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "caesar",
      name: "Caesar",
      attribute: "physical",
      rank: "A",
      specialty: "defense",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "corin",
      name: "Corin",
      attribute: "frost",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "ellen",
      name: "Ellen",
      attribute: "ice",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "evelyn",
      name: "Evelyn",
      attribute: "fire",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "grace",
      name: "Grace",
      attribute: "electric",
      rank: "A",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "harumasa",
      name: "Harumasa",
      attribute: "physical",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "hugo",
      name: "Hugo",
      attribute: "auric_ink",
      rank: "A",
      specialty: "defense",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "jane",
      name: "Jane",
      attribute: "fire",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "jufufu",
      name: "Jufufu",
      attribute: "electric",
      rank: "A",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "koleda",
      name: "Koleda",
      attribute: "fire",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "lighter",
      name: "Lighter",
      attribute: "fire",
      rank: "A",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "lucy",
      name: "Lucy",
      attribute: "physical",
      rank: "A",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "lycaon",
      name: "Lycaon",
      attribute: "ice",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "miyabi",
      name: "Miyabi",
      attribute: "ether",
      rank: "S",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "nekomata",
      name: "Nekomata",
      attribute: "physical",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "nicole",
      name: "Nicole",
      attribute: "auric_ink",
      rank: "S",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "pan",
      name: "Pan",
      attribute: "physical",
      rank: "A",
      specialty: "defense",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "piper",
      name: "Piper",
      attribute: "electric",
      rank: "A",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "pulchra",
      name: "Pulchra",
      attribute: "auric_ink",
      rank: "S",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "qingyi",
      name: "Qingyi",
      attribute: "ice",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "rina",
      name: "Rina",
      attribute: "electric",
      rank: "A",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "seed",
      name: "Seed",
      attribute: "physical",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "seth",
      name: "Seth",
      attribute: "fire",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "soldier11",
      name: "Soldier 11",
      attribute: "fire",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "soukaku",
      name: "Soukaku",
      attribute: "ice",
      rank: "A",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "trigger",
      name: "Trigger",
      attribute: "physical",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "vivian",
      name: "Vivian",
      attribute: "electric",
      rank: "S",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "wise",
      name: "Wise",
      attribute: "ether",
      rank: "A",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "yanagi",
      name: "Yanagi",
      attribute: "ice",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "yixuan",
      name: "Yixuan",
      attribute: "physical",
      rank: "A",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "yuzuha",
      name: "Yuzuha",
      attribute: "auric_ink",
      rank: "S",
      specialty: "support",
      installedMods: 0,
      activeMods: 0,
    },
    {
      id: "zhuyuan",
      name: "Zhu Yuan",
      attribute: "fire",
      rank: "S",
      specialty: "attack",
      installedMods: 0,
      activeMods: 0,
    },
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
