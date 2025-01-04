// src/components/dashboard/Tubesheet/components/StatusBar.tsx
/*
Information display component that:
- Shows total and selected tube counts
- Displays current section details
- Shows active scale percentage
- Provides measurement information
*/
import React, { memo } from 'react';

interface StatusBarProps {
  activeTubeCount: number;
  selectedTubeCount: number;
  currentSection: number;
  scale: number;
}

export const StatusBar = memo(({ 
  activeTubeCount, 
  selectedTubeCount, 
  currentSection, 
  scale 
}: StatusBarProps) => (
  <div className="absolute bottom-0 left-0 right-0 bg-[#242424] border-t border-[#2A2A2A] p-2">
    <div className="text-[#8A8A8A] text-xs flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span>Total: {activeTubeCount} tubes</span>
        <span>|</span>
        <span>Selected: {selectedTubeCount} tubes</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Section: {currentSection}.0 tubes @ 45° / 0.938"</span>
        <span>|</span>
        <span>Scale: {Math.round(scale * 100)}%</span>
      </div>
    </div>
  </div>
));

StatusBar.displayName = 'StatusBar';
export default StatusBar; 