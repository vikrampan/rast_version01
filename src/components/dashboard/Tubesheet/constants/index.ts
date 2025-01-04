// src/components/tubesheet/constants/index.ts
/*
Shared constants including:
- Grid dimensions and sizes
- Color definitions
- Scale limits
- Tool configurations
*/
import {
    Copy, Image, Square, Scissors, 
    FlipHorizontal, Move, RotateCcw, Union,
    Grid, Box, ArrowLeftRight, List,
    Type, Plus, Minus, MousePointer
  } from 'lucide-react';
  import { ToolbarGroup } from '../types';
  
  export const GRID_SIZE = 40;
  export const CELL_SIZE = 20;
  export const MAJOR_GRID_SIZE = 5;
  export const GRID_COLOR = '#2A2A2A';
  export const ACTIVE_GRID_COLOR = '#3B3B3B';
  export const CROSSHAIR_COLOR = '#3B3B3B';
  
  export const MIN_SCALE = 0.5;
  export const MAX_SCALE = 2;
  export const SCALE_STEP = 0.1;
  
  export const TOOLBAR_GROUPS: ToolbarGroup[] = [
    {
      title: 'Clipboard',
      tools: [
        { id: 'copy', icon: Copy, label: 'Copy Selection' },
        { id: 'paste', icon: Image, label: 'Paste Pattern' }
      ]
    },
    {
      title: 'Add',
      tools: [
        { id: 'add-single', icon: Plus, label: 'Add Single Tube' },
        { id: 'rectangular', icon: Square, label: 'Rectangular Pattern' },
        { id: 'specify', icon: Type, label: 'Specify Points' },
        { id: 'mirror', icon: FlipHorizontal, label: 'Mirror Pattern' }
      ]
    },
    {
      title: 'Remove',
      tools: [
        { id: 'remove-single', icon: Minus, label: 'Remove Single' },
        { id: 'remove-all', icon: Scissors, label: 'Clear Selection' }
      ]
    },
    {
      title: 'Modify',
      tools: [
        { id: 'select', icon: MousePointer, label: 'Select' },
        { id: 'move', icon: Move, label: 'Move Selection' },
        { id: 'flip', icon: FlipHorizontal, label: 'Flip Selection' },
        { id: 'join', icon: Union, label: 'Join Points' },
        { id: 'pattern', icon: Grid, label: 'Create Pattern' }
      ]
    },
    {
      title: 'Assign',
      tools: [
        { id: 'dimensions', icon: ArrowLeftRight, label: 'Set Dimensions' },
        { id: 'section', icon: Square, label: 'Assign Section' },
        { id: 'tube-number', icon: List, label: 'Renumber Tubes' },
        { id: 'direction', icon: RotateCcw, label: 'Set Direction' }
      ]
    }
  ];