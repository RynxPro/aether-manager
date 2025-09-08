import React from "react";

interface CharacterCardProps {
  character: {
    id: string;
    name: string;
    icon: string;
    installedMods: number;
    activeMods: number;
    description: string;
  };
  onClick: (id: string) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(character.id)}
      className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 hover:bg-gray-750 transition-all cursor-pointer group"
    >
      <div className="flex items-center space-x-4">
        {/* Character Icon */}
        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-600 transition-colors">
          <span className="text-3xl">{character.icon}</span>
        </div>

        {/* Character Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-white mb-1">
            {character.name}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {character.description}
          </p>

          {/* Mod Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">Installed:</span>
              <span className="text-white font-medium">
                {character.installedMods}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-gray-400">Active:</span>
              <span className="text-green-400 font-medium">
                {character.activeMods}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow Icon */}
        <div className="text-gray-400 group-hover:text-white transition-colors">
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface CharactersPageProps {
  onCharacterClick: (characterId: string) => void;
}

const CharactersPage: React.FC<CharactersPageProps> = ({
  onCharacterClick,
}) => {
  // Mock data - will be replaced with real data from hooks
  const characters = [
    {
      id: "belle",
      name: "Belle",
      icon: "👩‍💼",
      installedMods: 0,
      activeMods: 0,
      description:
        "The energetic and optimistic protagonist of Zenless Zone Zero",
    },
    {
      id: "nicole",
      name: "Nicole",
      icon: "👩‍🎨",
      installedMods: 0,
      activeMods: 0,
      description: "A mysterious artist with unique abilities",
    },
    {
      id: "anby",
      name: "Anby",
      icon: "👩‍🚀",
      installedMods: 0,
      activeMods: 0,
      description: "A skilled fighter with a cool demeanor",
    },
    {
      id: "billy",
      name: "Billy",
      icon: "👨‍💻",
      installedMods: 0,
      activeMods: 0,
      description: "A tech-savvy character with hacking abilities",
    },
    {
      id: "corin",
      name: "Corin",
      icon: "👨‍🔬",
      installedMods: 0,
      activeMods: 0,
      description: "A brilliant scientist and researcher",
    },
    {
      id: "ellen",
      name: "Ellen",
      icon: "👩‍🎭",
      installedMods: 0,
      activeMods: 0,
      description: "A performer with a flair for the dramatic",
    },
  ];

  const handleCharacterClick = (id: string) => {
    onCharacterClick(id);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Characters</h1>
        <p className="text-gray-400">Browse mods by character</p>
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onClick={handleCharacterClick}
          />
        ))}
      </div>

      {/* Empty State (if no characters) */}
      {characters.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No characters found
          </h3>
          <p className="text-gray-400">
            Characters will appear here once mods are installed
          </p>
        </div>
      )}
    </div>
  );
};

export default CharactersPage;
