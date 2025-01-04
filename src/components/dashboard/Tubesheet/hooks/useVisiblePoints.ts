// src/components/tubesheet/hooks/useVisiblePoints.ts
import { useMemo } from 'react';
import { Point } from '../types';
import { GRID_SIZE, CELL_SIZE } from '../constants';

export const useVisiblePoints = (containerRef: React.RefObject<HTMLDivElement>, scale: number) => {
  return useMemo(() => {
    if (!containerRef.current) return [];

    const { scrollTop, scrollLeft, clientWidth, clientHeight } = containerRef.current;
    const scaledCellSize = CELL_SIZE * scale;
    
    const startX = Math.floor(scrollLeft / scaledCellSize);
    const startY = Math.floor(scrollTop / scaledCellSize);
    const endX = Math.min(Math.ceil((scrollLeft + clientWidth) / scaledCellSize), GRID_SIZE);
    const endY = Math.min(Math.ceil((scrollTop + clientHeight) / scaledCellSize), GRID_SIZE);

    const points: Point[] = [];
    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        points.push({ x, y });
      }
    }
    
    return points;
  }, [containerRef, scale]);
};