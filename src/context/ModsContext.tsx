import React, { createContext, useContext, ReactNode } from 'react';
import { useMods as useModsHook, Mod } from '@/hooks/useMods';

interface ModsContextType extends ReturnType<typeof useModsHook> {
  // Add any additional context values here if needed
}

const ModsContext = createContext<ModsContextType | undefined>(undefined);

export const ModsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const modsState = useModsHook();
  
  return (
    <ModsContext.Provider value={modsState}>
      {children}
    </ModsContext.Provider>
  );
};

export const useModsContext = (): ModsContextType => {
  const context = useContext(ModsContext);
  if (context === undefined) {
    throw new Error('useModsContext must be used within a ModsProvider');
  }
  return context;
};

// Helper hook to get a specific mod by ID
export const useMod = (modId: string): Mod | undefined => {
  const { mods } = useModsContext();
  return mods.find(mod => mod.id === modId);
};
