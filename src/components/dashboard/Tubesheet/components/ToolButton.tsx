// src/components/tubesheet/components/ToolButton.tsx
import React, { memo } from 'react';
import { ToolButtonProps } from '../types';

export const ToolButton = memo(({ tool, isSelected, onClick }: ToolButtonProps) => {
  const IconComponent = tool.icon;
  if (!IconComponent) return null;

  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-all duration-200 relative group
        ${isSelected ? 'bg-[#383838] ring-1 ring-blue-500' : 'hover:bg-[#383838]'}
      `}
      title={tool.label}
      aria-label={tool.label}
    >
      <IconComponent className="w-4 h-4 text-[#E0E0E0]" />
      <span className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 translate-y-full 
        bg-[#383838] text-[#E0E0E0] text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100
        pointer-events-none whitespace-nowrap z-50">
        {tool.label}
      </span>
    </button>
  );
});

ToolButton.displayName = 'ToolButton';