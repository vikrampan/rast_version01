// src/components/tubesheet/hooks/useZoom.ts
/*
Custom hook managing zoom functionality that:
- Controls scale value
- Handles zoom limits
- Provides zoom in/out handlers
*/
import { useState, useCallback } from 'react';
import { MIN_SCALE, MAX_SCALE, SCALE_STEP } from '../constants';

export const useZoom = () => {
  const [scale, setScale] = useState(1);

  const handleZoom = useCallback((delta: number) => {
    setScale(prev => Math.min(Math.max(MIN_SCALE, prev + delta), MAX_SCALE));
  }, []);

  return {
    scale,
    handleZoom
  };
};