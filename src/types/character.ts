export interface Character {
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
}
