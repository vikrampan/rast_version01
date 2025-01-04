/*
Custom hook managing tool selection that:
- Controls active tool state
- Handles tool selection changes
- Provides tool action handlers
*/
import { useState, useCallback } from 'react';

export const useToolManagement = () => {
  const [selectedTool, setSelectedTool] = useState<string>('');

  const selectTool = useCallback((toolId: string) => {
    setSelectedTool(toolId);
  }, []);

  return {
    selectedTool,
    selectTool
  };
};
