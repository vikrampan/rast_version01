// src/components/tubesheet/components/TubePoint.tsx
/*
Individual tube point component that:
- Renders each tube position on grid
- Displays tube status (active/removed/selected)
- Shows tube numbers
- Handles click interactions
*/
import React, { memo } from 'react';
import { TubePointProps } from '../types';
import { CELL_SIZE } from '../constants';

export const TubePoint = memo(({ point, tube, onClick }: TubePointProps) => (
  <div
    className={`absolute rounded-full transition-colors duration-200 cursor-pointer
      ${tube ? 
        tube.status === 'active' ? 'bg-green-500 ring-2 ring-green-600' :
        tube.status === 'removed' ? 'bg-red-500 ring-2 ring-red-600' :
        'bg-blue-500 ring-2 ring-blue-600' : 
        'bg-gray-800 hover:bg-gray-700 hover:ring-2 hover:ring-gray-600'
      }`}
    style={{
      width: CELL_SIZE - 4,
      height: CELL_SIZE - 4,
      transform: `translate(${point.x * CELL_SIZE}px, ${point.y * CELL_SIZE}px)`,
    }}
    onClick={onClick}
  >
    {tube?.number && (
      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold text-white">
        {tube.number}
      </span>
    )}
  </div>
));

TubePoint.displayName = 'TubePoint';