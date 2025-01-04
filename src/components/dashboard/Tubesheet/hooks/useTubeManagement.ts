// src/components/dashboard/Tubesheet/hooks/useTubeManagement.ts

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Point, Tube, ToolType, TubeStatus, TubeManagementHook } from '../types';

/**
 * Custom hook for managing tube operations
 * Handles tube state, actions, and tracking
 */
export const useTubeManagement = (): TubeManagementHook => {
  // State management
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('Section 1');
  const [lastTubeNumber, setLastTubeNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Convert tubes array to optimized data structure
   * Adds key property for efficient lookups
   */
  const tubeMap = useMemo(() => {
    try {
      return tubes.map(tube => ({
        ...tube,
        key: `${tube.position.x}-${tube.position.y}`
      }));
    } catch (err) {
      setError('Error processing tube map');
      return [];
    }
  }, [tubes]);

  /**
   * Handle tube-related actions with error handling
   */
  const handleTubeAction = useCallback((point: Point, toolType: ToolType) => {
    try {
      setIsLoading(true);
      const existingTube = tubeMap.find(t => 
        t.position.x === point.x && t.position.y === point.y
      );

      setTubes(prev => {
        switch (toolType) {
          case 'select':
            if (existingTube) {
              return prev.map(t => ({
                ...t,
                status: t.id === existingTube.id
                  ? (t.status === 'selected' ? 'active' : 'selected' as TubeStatus)
                  : t.status,
                lastModified: new Date()
              }));
            }
            return prev;

          case 'mark':
            if (existingTube) {
              return prev.map(t => ({
                ...t,
                status: t.id === existingTube.id ? 'marked' as TubeStatus : t.status,
                lastModified: new Date()
              }));
            }
            return prev;

          case 'add-single':
            if (!existingTube) {
              setLastTubeNumber(prev => prev + 1);
              return [...prev, {
                id: `tube-${Date.now()}`,
                position: point,
                status: 'active' as TubeStatus,
                number: lastTubeNumber + 1,
                section: Number(currentSection.replace('Section ', '')),
                lastModified: new Date()
              }];
            }
            return prev;

          case 'remove-single':
            if (existingTube) {
              return prev.map(t => ({
                ...t,
                status: t.id === existingTube.id ? 'removed' as TubeStatus : t.status,
                lastModified: new Date()
              }));
            }
            return prev;

          case 'inspect':
            if (existingTube) {
              return prev.map(t => ({
                ...t,
                metadata: t.id === existingTube.id
                  ? {
                      ...t.metadata,
                      inspectionDate: new Date(),
                      inspector: 'Current User'
                    }
                  : t.metadata,
                lastModified: new Date()
              }));
            }
            return prev;

          default:
            return prev;
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error performing tube action');
    } finally {
      setIsLoading(false);
    }
  }, [tubeMap, currentSection, lastTubeNumber]);

  // Memoized counts
  const activeTubeCount = useMemo(() => 
    tubes.filter(t => t.status === 'active').length,
  [tubes]);

  const selectedTubeCount = useMemo(() => 
    tubes.filter(t => t.status === 'selected').length,
  [tubes]);

  // Auto-clear errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    tubeMap,
    activeTubeCount,
    selectedTubeCount,
    currentSection,
    handleTubeAction,
    isLoading,
    error
  };
};