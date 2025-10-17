import { createContext, useContext } from 'react';
import { BMCProject, BMCBlockId, BusinessContext } from '../../types/bmc';

interface BMCContextProps {
  project: BMCProject | null;
  loading: boolean;
  error: string | null;
  currentBlock: BMCBlockId | null;
  readonly: boolean;
  onUpdateBlock: (blockId: BMCBlockId, content: string) => void;
  onUpdateBusinessContext: (context: BusinessContext) => void;
  setCurrentBlock: (blockId: BMCBlockId | null) => void;
}

export const BMCContext = createContext<BMCContextProps | undefined>(undefined);

export const useBMCContext = () => {
  const context = useContext(BMCContext);
  if (!context) {
    throw new Error('useBMCContext must be used within a BMCProvider');
  }
  return context;
};

