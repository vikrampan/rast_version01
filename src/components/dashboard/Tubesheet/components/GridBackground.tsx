// src/components/tubesheet/components/GridBackground.tsx
/*
Grid visualization component that:
- Renders grid pattern backdrop
- Creates major/minor grid lines
- Shows measurement overlay
- Handles grid scaling
*/
import React, { memo } from 'react';
import { CELL_SIZE, MAJOR_GRID_SIZE, GRID_COLOR, ACTIVE_GRID_COLOR, CROSSHAIR_COLOR } from '../constants';

export const GridBackground = memo(() => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none">
    <defs>
      <pattern id="grid" width={CELL_SIZE} height={CELL_SIZE} patternUnits="userSpaceOnUse">
        <path 
          d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`} 
          fill="none" 
          stroke={GRID_COLOR} 
          strokeWidth="0.5" 
        />
      </pattern>
      <pattern 
        id="majorGrid" 
        width={CELL_SIZE * MAJOR_GRID_SIZE} 
        height={CELL_SIZE * MAJOR_GRID_SIZE} 
        patternUnits="userSpaceOnUse"
      >
        <rect 
          width={CELL_SIZE * MAJOR_GRID_SIZE} 
          height={CELL_SIZE * MAJOR_GRID_SIZE} 
          fill="url(#grid)" 
        />
        <path 
          d={`M ${CELL_SIZE * MAJOR_GRID_SIZE} 0 L 0 0 0 ${CELL_SIZE * MAJOR_GRID_SIZE}`} 
          fill="none" 
          stroke={ACTIVE_GRID_COLOR} 
          strokeWidth="1" 
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#majorGrid)" />
    <line x1="50%" y1="0" x2="50%" y2="100%" stroke={CROSSHAIR_COLOR} strokeWidth="1" />
    <line x1="0" y1="50%" x2="100%" y2="50%" stroke={CROSSHAIR_COLOR} strokeWidth="1" />
  </svg>
));

GridBackground.displayName = 'GridBackground';