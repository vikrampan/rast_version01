// src/components/dashboard/Tubesheet/Tubesheet.tsx

import React, { Suspense, lazy, useState, useCallback, useEffect } from 'react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { ErrorTrackingService } from '@/utils/errorTracking';
import { useTubeManagement } from './hooks/useTubeManagement';
import Controls from './components/Controls';
import Quadrant from './components/Quadrant';
import StatusBar from './components/StatusBar';
import {
  Point,
  ToolType,
  ZOOM_LIMITS,
  SCREEN_NUMBERS,
  TubeData,
  ErrorDetail
} from './types';

// Initialize error tracking singleton
const errorTracker = ErrorTrackingService.getInstance();

// Lazy loaded components with error boundaries
const TubeGrid = lazy(() => 
  import('./components/TubeGrid')
    .then(module => ({ default: module.default }))
    .catch(error => {
      errorTracker.trackError(error, {
        componentName: 'TubeGrid',
        actionType: 'lazyLoad'
      });
      throw error;
    })
);

const Toolbar = lazy(() => 
  import('@/components/dashboard/Tubesheet/components/ToolbarSection')
    .then(module => ({ default: module.default }))
    .catch(error => {
      errorTracker.trackError(error, {
        componentName: 'Toolbar',
        actionType: 'lazyLoad'
      });
      throw error;
    })
);

// Loading components
const LoadingSpinner: React.FC = () => (
  <div 
    className="flex items-center justify-center h-full"
    role="progressbar"
    aria-label="Loading component"
  >
    <div 
      className="w-8 h-8 border-2 border-[#FFC857] rounded-full animate-spin border-t-transparent"
      aria-hidden="true" 
    />
  </div>
);

// Memoized toolbar loading fallback
const ToolbarLoadingFallback = React.memo(() => (
  <div 
    className="h-12 bg-[#242424] animate-pulse" 
    role="progressbar"
    aria-label="Loading toolbar"
  />
));
ToolbarLoadingFallback.displayName = 'ToolbarLoadingFallback';

/**
 * Main Tubesheet Component
 */
const Tubesheet: React.FC = () => {
  // Error handling wrapper
  const handleError = useCallback((error: Error | ErrorDetail) => {
    errorTracker.trackError(error instanceof Error ? error : new Error(error.message), {
      componentName: 'Tubesheet',
      actionType: 'componentError'
    });
  }, []);

  // Custom hook with error handling
  const {
    tubeMap,
    activeTubeCount,
    selectedTubeCount,
    currentSection,
    handleTubeAction,
    isLoading,
    error: tubeManagementError
  } = useTubeManagement();

  // State management
  const [scale, setScale] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showCrosshair, setShowCrosshair] = useState<boolean>(true);
  const [selectedTool, setSelectedTool] = useState<ToolType>('');
  const [maximizedQuadrant, setMaximizedQuadrant] = useState<number | null>(null);

  // Error effect
  useEffect(() => {
    if (tubeManagementError) {
      errorTracker.trackError(new Error(tubeManagementError), {
        componentName: 'Tubesheet',
        actionType: 'tubeManagement'
      });
    }
  }, [tubeManagementError]);

  // Handlers
  const handleZoom = useCallback((delta: number) => {
    try {
      setScale(prev => {
        const newScale = Math.min(
          Math.max(ZOOM_LIMITS.MIN, prev + delta),
          ZOOM_LIMITS.MAX
        );
        return newScale;
      });
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError]);

  const handleQuadrantMaximize = useCallback((screenNumber: number) => {
    try {
      setMaximizedQuadrant(prev => prev === screenNumber ? null : screenNumber);
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError]);

  const handleToolSelect = useCallback((toolId: ToolType) => {
    try {
      setSelectedTool(toolId);
    } catch (error) {
      handleError(error as Error);
    }
  }, [handleError]);

  const handleGridToggle = useCallback(() => {
    setShowGrid(prev => !prev);
  }, []);

  const handleCrosshairToggle = useCallback(() => {
    setShowCrosshair(prev => !prev);
  }, []);

  const handleTubeClick = useCallback((point: Point) => {
    try {
      if (!selectedTool) return;
      handleTubeAction(point, selectedTool);
    } catch (error) {
      handleError(error as Error);
    }
  }, [selectedTool, handleTubeAction, handleError]);

  return (
    <ErrorBoundary onError={handleError}>
      <div className="h-[calc(100vh-4rem)] bg-[#181818] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Toolbar Section */}
          <ErrorBoundary onError={handleError}>
            <Suspense fallback={<ToolbarLoadingFallback />}>
              <Toolbar
                selectedTool={selectedTool}
                onToolSelect={handleToolSelect}
                isLoading={isLoading}
              />
            </Suspense>
          </ErrorBoundary>

          {/* Main Grid Area */}
          <div className="flex-1 p-4 overflow-hidden">
            <div 
              className={`grid ${
                maximizedQuadrant ? 'grid-cols-1' : 'grid-cols-2 grid-rows-2'
              } gap-4 h-full bg-[#1E1E1E] rounded-lg shadow-xl relative`}
            >
              {SCREEN_NUMBERS.map((screenNumber) => (
                !maximizedQuadrant || maximizedQuadrant === screenNumber ? (
                  <ErrorBoundary
                    key={screenNumber}
                    onError={handleError}
                  >
                    <Quadrant 
                      screenNumber={screenNumber} 
                      onMaximize={handleQuadrantMaximize}
                      quadrantName={`Quadrant ${screenNumber}`}
                    >
                      <Suspense fallback={<LoadingSpinner />}>
                        <TubeGrid
                          tubes={tubeMap}
                          onPointClick={handleTubeClick}
                          selectedTool={selectedTool}
                          scale={scale}
                          showGrid={showGrid}
                          showCrosshair={showCrosshair}
                          isLoading={isLoading}
                        />
                      </Suspense>
                    </Quadrant>
                  </ErrorBoundary>
                ) : null
              ))}

              {/* Controls */}
              <div className="fixed bottom-8 right-8 z-50">
                <Controls
                  scale={scale}
                  onZoomIn={() => handleZoom(ZOOM_LIMITS.STEP)}
                  onZoomOut={() => handleZoom(-ZOOM_LIMITS.STEP)}
                  showGrid={showGrid}
                  showCrosshair={showCrosshair}
                  onToggleGrid={handleGridToggle}
                  onToggleCrosshair={handleCrosshairToggle}
                />
              </div>
            </div>

            {/* Status Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-[#282828] z-40">
              <StatusBar
                activeTubeCount={activeTubeCount}
                selectedTubeCount={selectedTubeCount}
                currentSection={currentSection.toString()}
                scale={scale}
                error={tubeManagementError}
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(Tubesheet);