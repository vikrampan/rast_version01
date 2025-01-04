interface ErrorDetail {
    message: string;
    stack?: string;
    componentName?: string;
    timestamp: Date;
    additionalInfo?: Record<string, unknown>;
  }
  
  interface ErrorTrackingOptions {
    errorInfo?: React.ErrorInfo;
    componentStack?: string;
    tags?: Record<string, string>;
    extras?: Record<string, unknown>;
  }
  
  export class ErrorTrackingService {
    private static instance: ErrorTrackingService;
    private errorListeners: Set<(error: ErrorDetail) => void>;
    private isInitialized: boolean;
  
    private constructor() {
      this.errorListeners = new Set();
      this.isInitialized = false;
      this.initializeGlobalHandlers();
    }
  
    static getInstance(): ErrorTrackingService {
      if (!ErrorTrackingService.instance) {
        ErrorTrackingService.instance = new ErrorTrackingService();
      }
      return ErrorTrackingService.instance;
    }
  
    private initializeGlobalHandlers(): void {
      if (typeof window !== 'undefined' && !this.isInitialized) {
        window.addEventListener('error', this.handleGlobalError);
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
        this.isInitialized = true;
      }
    }
  
    private handleGlobalError = (event: ErrorEvent): void => {
      const errorDetail: ErrorDetail = {
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        componentName: 'GlobalError'
      };
      this.notifyListeners(errorDetail);
    };
  
    private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      const errorDetail: ErrorDetail = {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date(),
        componentName: 'UnhandledRejection'
      };
      this.notifyListeners(errorDetail);
    };
  
    trackError(error: Error, options?: ErrorTrackingOptions): void {
      const errorDetail: ErrorDetail = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date(),
        componentName: options?.errorInfo?.componentStack
          ?.split('\n')[1]
          ?.trim()
          ?.split(' ')[1] || 'Unknown',
        additionalInfo: {
          componentStack: options?.errorInfo?.componentStack,
          ...options?.extras
        }
      };
  
      console.error('Tracked Error:', {
        ...errorDetail,
        tags: options?.tags
      });
  
      this.notifyListeners(errorDetail);
    }
  
    addErrorListener(listener: (error: ErrorDetail) => void): () => void {
      this.errorListeners.add(listener);
      return () => this.errorListeners.delete(listener);
    }
  
    private notifyListeners(error: ErrorDetail): void {
      this.errorListeners.forEach(listener => {
        try {
          listener(error);
        } catch (listenerError) {
          console.error('Error in error listener:', listenerError);
        }
      });
    }
  
    cleanup(): void {
      if (typeof window !== 'undefined' && this.isInitialized) {
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
        this.isInitialized = false;
      }
      this.errorListeners.clear();
    }
  }