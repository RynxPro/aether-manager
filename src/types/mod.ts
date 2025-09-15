export interface Mod {
  id: string;
  title: string;
  thumbnail?: string;
  isActive: boolean;
  dateAdded: string;
  character?: string;
  description?: string;
  filePath: string;
  originalName: string;
}
