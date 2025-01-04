// src/components/dashboard/Tubesheet/types/index.ts

import { ReactNode } from 'react';

/**
 * Core Types
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Tube Related Types
 */
export interface Tube {
  id: string;
  position: Point;
  status: TubeStatus;
  number?: number;
  section?: number;
  key?: string;
  metadata?: TubeMetadata;
  lastModified?: Date;
}

export type TubeStatus = 'active' | 'removed' | 'selected' | 'marked' | 'error';

export interface TubeMetadata {
  condition?: string;
  notes?: string;
  inspectionDate?: Date;
  inspector?: string;
}

/**
 * Tool Types
 */
export type ToolType = 'select' | 'mark' | 'measure' | 'inspect' | 'add-single' | 'remove-single' | '';

/**
 * Hook Types
 */
export interface TubeManagementHook {
  tubeMap: Tube[];
  activeTubeCount: number;
  selectedTubeCount: number;
  currentSection: string;
  handleTubeAction: (point: Point, toolType: ToolType) => void;
  isLoading: boolean;
  error: string | null;
}

/**
 * Component Props
 */
export interface TubeGridProps {
  tubes: Tube[];
  onPointClick: (point: Point) => void;
  selectedTool: ToolType;
  scale: number;
  showGrid?: boolean;
  showCrosshair?: boolean;
  isLoading?: boolean;
}

export interface QuadrantProps {
  screenNumber: number;
  children: ReactNode;
  onMaximize: (screenNumber: number) => void;
  quadrantName: string;
}

export interface ControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  showGrid: boolean;
  showCrosshair: boolean;
  onToggleGrid: () => void;
  onToggleCrosshair: () => void;
}

export interface StatusBarProps {
  activeTubeCount: number;
  selectedTubeCount: number;
  currentSection: string;
  scale: number;
  error?: string | null;
}

/**
 * Constants
 */
export const ZOOM_LIMITS = {
  MIN: 0.5,
  MAX: 2,
  STEP: 0.1,
} as const;

export const SCREEN_NUMBERS = [1, 2, 3, 4] as const;

export const ANIMATION_DURATION = 300; // ms