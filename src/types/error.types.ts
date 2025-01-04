export interface ErrorDetail {
    message: string;
    stack?: string;
    componentName?: string;
    timestamp: Date;
    additionalInfo?: Record<string, unknown>;
  }
  
  export interface ErrorBoundaryProps {
    children: React.ReactNode;
    onError?: (error: ErrorDetail) => void;
    fallback?: React.ReactNode;
  }
  
  export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
  }