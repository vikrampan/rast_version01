// src/components/dashboard/Tubesheet/components/Controls.tsx
/*
Grid control component that:
- Manages zoom in/out functionality 
- Toggles grid and crosshair visibility
- Shows current scale percentage
- Provides quick access tools
*/
import React, { memo } from 'react';
import { Settings, ZoomIn, ZoomOut, Crosshair, Grid } from 'lucide-react';

interface ControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  showGrid: boolean;
  showCrosshair: boolean;
  onToggleGrid: () => void;
  onToggleCrosshair: () => void;
}

const Controls = memo(({ 
  scale, 
  onZoomIn, 
  onZoomOut, 
  showGrid, 
  showCrosshair, 
  onToggleGrid, 
  onToggleCrosshair 
}: ControlsProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex gap-2">
      <button onClick={onZoomIn} className="p-2 bg-[#242424] rounded hover:bg-[#383838] ring-1 ring-[#2A2A2A]">
        <ZoomIn className="w-4 h-4 text-[#E0E0E0]" />
      </button>
      <button onClick={onZoomOut} className="p-2 bg-[#242424] rounded hover:bg-[#383838] ring-1 ring-[#2A2A2A]">
        <ZoomOut className="w-4 h-4 text-[#E0E0E0]" />
      </button>
      <button className="p-2 bg-[#242424] rounded hover:bg-[#383838] ring-1 ring-[#2A2A2A]">
        <Settings className="w-4 h-4 text-[#E0E0E0]" />
      </button>
    </div>
    <div className="bg-[#242424] p-2 rounded ring-1 ring-[#2A2A2A] text-xs text-center text-[#E0E0E0]">
      {Math.round(scale * 100)}%
    </div>
  </div>
));

Controls.displayName = 'Controls';

export default Controls;