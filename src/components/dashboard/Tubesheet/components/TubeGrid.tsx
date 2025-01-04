//src/components/dashboard/Tubesheet/components/TubeGrid.tsx
/*
Grid management component that:
- Renders the tube placement grid
- Handles tube positioning and visualization 
- Controls grid scaling/zooming
- Optimizes visible point rendering
*/
import React, { memo, useRef } from 'react';
import { TubeGridProps } from '../types';
import { GridBackground } from './GridBackground';
import { TubePoint } from './TubePoint';
import { useVisiblePoints } from '../hooks/useVisiblePoints';

const TubeGrid = memo(({ tubes, onPointClick, selectedTool, scale }: TubeGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visiblePoints = useVisiblePoints(containerRef, scale);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-[#1A1A1A] overflow-auto"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: '0 0'
      }}
    >
      <GridBackground />
      {visiblePoints.map((point) => (
        <TubePoint
          key={`${point.x}-${point.y}`}
          point={point}
          tube={tubes.get(`${point.x}-${point.y}`)}
          onClick={() => onPointClick(point)}
        />
      ))}
    </div>
  );
});

TubeGrid.displayName = 'TubeGrid';

export default TubeGrid;