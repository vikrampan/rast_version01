import React from 'react';
import { ErrorBoundaryProps, ErrorBoundaryState, ErrorDetail } from '@/types/error.types';
import { ErrorTrackingService } from '@/utils/errorTracking';

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorTracker: ErrorTrackingService;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
    this.errorTracker = ErrorTrackingService.getInstance();
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Create error detail
    const errorDetail: ErrorDetail = {
      message: error.message,
      stack: error.stack,
      componentName: 'ErrorBoundary',
      timestamp: new Date(),
      additionalInfo: {
        componentStack: errorInfo.componentStack
      }
    };

    // Track the error
    this.errorTracker.trackError(error, {
      errorInfo,
      componentStack: errorInfo.componentStack
    });

    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(errorDetail);
    }

    this.setState({
      errorInfo
    });
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-[#181818] text-white p-6">
          <div className="max-w-lg w-full bg-[#1E1E1E] rounded-lg shadow-xl p-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <svg 
                  className="w-8 h-8 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-center">Something went wrong</h2>
              
              <div className="w-full mb-6 p-4 bg-[#242424] rounded text-left overflow-auto max-h-40">
                <p className="text-red-400 mb-2">{this.state.error?.message}</p>
                {process.env.NODE_ENV === 'development' && (
                  <pre className="text-xs text-gray-400 mt-2 whitespace-pre-wrap">
                    {this.state.error?.stack}
                  </pre>
                )}
              </div>

              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-[#FFC857] text-black rounded-lg hover:bg-[#FFD857] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFC857]/50"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }

  componentWillUnmount(): void {
    this.errorTracker.cleanup();
  }
}