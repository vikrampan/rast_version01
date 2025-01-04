//src/components/dashboard/Tubesheet/components/Quadrant.tsx
/* 
Screen section component that:
- Manages one of four viewing quadrants
- Controls maximize/crosshair functions
- Handles overlay info and hover states
- Displays grid and measurement details
*/
import React, { memo } from 'react';
import { QuadrantProps } from '../types';
import { Maximize2, Crosshair, Grid } from 'lucide-react';

const Quadrant = memo(({ screenNumber, children, onMaximize }: QuadrantProps) => (
  <div className="relative bg-[#242424] rounded-lg shadow-lg overflow-hidden border border-[#282828] transition-all duration-200 hover:shadow-2xl group">
    {/* Header with controls */}
    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#1E1E1E] via-[#1E1E1E]/70 to-transparent p-3 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#E0E0E0] text-sm font-medium">Screen {screenNumber}</span>
          <div className="px-2 py-1 text-xs bg-[#282828] rounded-full text-[#9A9A9A]">
            45° / 0.938"
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="p-1.5 rounded-lg hover:bg-[#383838] transition-colors"
            title="Toggle Crosshair"
          >
            <Crosshair className="w-4 h-4 text-[#666666] hover:text-[#E0E0E0]" />
          </button>
          <button 
            className="p-1.5 rounded-lg hover:bg-[#383838] transition-colors"
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4 text-[#666666] hover:text-[#E0E0E0]" />
          </button>
          <button 
            className="p-1.5 rounded-lg hover:bg-[#383838] transition-colors"
            onClick={onMaximize}
            title="Maximize"
          >
            <Maximize2 className="w-4 h-4 text-[#666666] hover:text-[#E0E0E0]" />
          </button>
        </div>
      </div>
    </div>

    {/* Main content area */}
    <div className="h-full pt-14 pb-2 px-2">
      <div className="w-full h-full bg-[#1A1A1A] rounded-lg overflow-hidden relative">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative h-full z-10">
          {children}
        </div>
      </div>
    </div>

    {/* Bottom info overlay */}
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1E1E1E] to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
      <div className="text-xs text-[#9A9A9A] flex items-center justify-between px-2">
        <span>Current Section: 1.0</span>
        <span>Pitch: 0.938"</span>
      </div>
    </div>
  </div>
));

Quadrant.displayName = 'Quadrant';

export default Quadrant;