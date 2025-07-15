import { useState, useCallback, useRef, useEffect } from 'react';

// Error types for UFO research platform
export enum ResearchErrorCode {
  // Network errors
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_OFFLINE = 'NETWORK_OFFLINE',
  API_UNAVAILABLE = 'API_UNAVAILABLE',
  
  // Database errors
  DATABASE_CONNECTION_FAILED = 'DATABASE_CONNECTION_FAILED',
  QUERY_EXECUTION_FAILED = 'QUERY_EXECUTION_FAILED',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  
  // AI service errors
  AI_SERVICE_UNAVAILABLE = 'AI_SERVICE_UNAVAILABLE',
  AI_QUOTA_EXCEEDED = 'AI_QUOTA_EXCEEDED',
  AI_RESPONSE_INVALID = 'AI_RESPONSE_INVALID',
  AI_TIMEOUT = 'AI_TIMEOUT',
  
  // Spatial analysis errors
  SPATIAL_ANALYSIS_FAILED = 'SPATIAL_ANALYSIS_FAILED',
  INSUFFICIENT_NODES = 'INSUFFICIENT_NODES',
  INVALID_COORDINATES = 'INVALID_COORDINATES',
  
  // Tour system errors
  TOUR_CREATION_FAILED = 'TOUR_CREATION_FAILED',
  TOUR_PROGRESSION_FAILED = 'TOUR_PROGRESSION_FAILED',
  TOUR_NOT_FOUND = 'TOUR_NOT_FOUND',
  
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_NODE_TYPE = 'INVALID_NODE_TYPE',
  
  // System errors
  MEMORY_EXCEEDED = 'MEMORY_EXCEEDED',
  PROCESSING_TIMEOUT = 'PROCESSING_TIMEOUT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ResearchError {
  code: ResearchErrorCode;
  message: string;
  details?: any;
  timestamp: Date;
  operation: string;
  userId?: string;
  sessionId?: string;
  recoverable: boolean;
  retryable: boolean;
}

export interface ErrorRecoveryStrategy {
  immediate: () => Promise<boolean>;
  delayed: () => Promise<boolean>;
  fallback: () => Promise<boolean>;
}

// Error factory for creating standardized errors
export class ResearchErrorFactory {
  static createError(
    code: ResearchErrorCode,
    message: string,
    operation: string,
    details?: any,
    userId?: string,
    sessionId?: string
  ): ResearchError {
    const isRecoverable = this.isRecoverable(code);
    const isRetryable = this.isRetryable(code);

    return {
      code,
      message,
      details,
      timestamp: new Date(),
      operation,
      userId,
      sessionId,
      recoverable: isRecoverable,
      retryable: isRetryable
    };
  }

  private static isRecoverable(code: ResearchErrorCode): boolean {
    const recoverableErrors = [
      ResearchErrorCode.NETWORK_TIMEOUT,
      ResearchErrorCode.AI_SERVICE_UNAVAILABLE,
      ResearchErrorCode.DATABASE_CONNECTION_FAILED,
      ResearchErrorCode.PROCESSING_TIMEOUT
    ];
    return recoverableErrors.includes(code);
  }

  private static isRetryable(code: ResearchErrorCode): boolean {
    const retryableErrors = [
      ResearchErrorCode.NETWORK_TIMEOUT,
      ResearchErrorCode.AI_TIMEOUT,
      ResearchErrorCode.PROCESSING_TIMEOUT,
      ResearchErrorCode.DATABASE_CONNECTION_FAILED
    ];
    return retryableErrors.includes(code);
  }
}

// Circuit breaker pattern for API calls
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private retryTimeout: number = 30000 // 30 seconds
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.retryTimeout) {
        this.state = 'half-open';
      } else {
        throw ResearchErrorFactory.createError(
          ResearchErrorCode.API_UNAVAILABLE,
          'Circuit breaker is open',
          'circuit-breaker'
        );
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }

  getState(): { state: string; failures: number } {
    return {
      state: this.state,
      failures: this.failures
    };
  }
}

// Retry mechanism with exponential backoff
export class RetryManager {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    maxDelay: number = 10000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Check if error is retryable
        if (error instanceof Error && 'code' in error) {
          const researchError = error as ResearchError;
          if (!researchError.retryable) {
            throw error;
          }
        }
        
        // Calculate exponential backoff delay
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}

// Error boundary hook for React components
export function useErrorBoundary() {
  const [error, setError] = useState<ResearchError | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const retryCount = useRef(0);

  const handleError = useCallback((error: Error | ResearchError, errorInfo?: any) => {
    let researchError: ResearchError;
    
    if ('code' in error) {
      researchError = error as ResearchError;
    } else {
      researchError = ResearchErrorFactory.createError(
        ResearchErrorCode.UNKNOWN_ERROR,
        error.message || 'An unknown error occurred',
        'error-boundary',
        errorInfo
      );
    }

    setError(researchError);
    
    // Log error for monitoring
    console.error('Research Error:', researchError);
    
    // Send to error tracking service
    if (typeof window !== 'undefined' && (window as any).errorTracker) {
      (window as any).errorTracker.captureError(researchError);
    }
  }, []);

  const recover = useCallback(async () => {
    if (!error || !error.recoverable) return false;
    
    setIsRecovering(true);
    
    try {
      // Attempt recovery based on error type
      switch (error.code) {
        case ResearchErrorCode.NETWORK_TIMEOUT:
          // Wait and retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          break;
          
        case ResearchErrorCode.AI_SERVICE_UNAVAILABLE:
          // Switch to fallback AI service
          await switchToFallbackAIService();
          break;
          
        case ResearchErrorCode.DATABASE_CONNECTION_FAILED:
          // Reinitialize database connection
          await reinitializeDatabaseConnection();
          break;
          
        default:
          return false;
      }
      
      setError(null);
      retryCount.current = 0;
      return true;
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      retryCount.current++;
      
      if (retryCount.current >= 3) {
        // Too many recovery attempts, show permanent error
        setError(ResearchErrorFactory.createError(
          ResearchErrorCode.UNKNOWN_ERROR,
          'Maximum recovery attempts exceeded',
          'error-recovery'
        ));
      }
      
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, [error]);

  const clearError = useCallback(() => {
    setError(null);
    retryCount.current = 0;
  }, []);

  return {
    error,
    isRecovering,
    handleError,
    recover,
    clearError
  };
}

// Validation utilities
export class ValidationUtils {
  static validateNodeType(type: string): boolean {
    const validTypes = [
      'events', 'testimonies', 'personnel', 'organizations',
      'locations', 'documents', 'topics', 'artifacts'
    ];
    return validTypes.includes(type);
  }

  static validateSearchQuery(query: string): ResearchError | null {
    if (!query || query.trim().length === 0) {
      return ResearchErrorFactory.createError(
        ResearchErrorCode.MISSING_REQUIRED_FIELD,
        'Search query is required',
        'validation'
      );
    }

    if (query.length > 500) {
      return ResearchErrorFactory.createError(
        ResearchErrorCode.INVALID_INPUT,
        'Search query is too long (max 500 characters)',
        'validation'
      );
    }

    return null;
  }

  static validateCoordinates(x: number, y: number): ResearchError | null {
    if (typeof x !== 'number' || typeof y !== 'number') {
      return ResearchErrorFactory.createError(
        ResearchErrorCode.INVALID_COORDINATES,
        'Coordinates must be numbers',
        'validation'
      );
    }

    if (!isFinite(x) || !isFinite(y)) {
      return ResearchErrorFactory.createError(
        ResearchErrorCode.INVALID_COORDINATES,
        'Coordinates must be finite numbers',
        'validation'
      );
    }

    return null;
  }
}

// Global error handler for the research platform
export class ResearchErrorHandler {
  private static instance: ResearchErrorHandler;
  private errorQueue: ResearchError[] = [];
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private errorCallbacks = new Set<(error: ResearchError) => void>();

  static getInstance(): ResearchErrorHandler {
    if (!ResearchErrorHandler.instance) {
      ResearchErrorHandler.instance = new ResearchErrorHandler();
    }
    return ResearchErrorHandler.instance;
  }

  handleError(error: ResearchError): void {
    this.errorQueue.push(error);
    
    // Notify callbacks
    this.errorCallbacks.forEach(callback => callback(error));
    
    // Process error based on severity
    if (error.code === ResearchErrorCode.MEMORY_EXCEEDED) {
      this.handleCriticalError(error);
    } else if (error.recoverable) {
      this.attemptRecovery(error);
    }
  }

  private handleCriticalError(error: ResearchError): void {
    console.error('Critical error:', error);
    
    // Clear caches to free memory
    if (typeof window !== 'undefined') {
      localStorage.removeItem('researchMessages');
      localStorage.removeItem('spatialAnalysisCache');
    }
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
  }

  private async attemptRecovery(error: ResearchError): Promise<void> {
    const circuitBreaker = this.getCircuitBreaker(error.operation);
    
    try {
      await circuitBreaker.execute(async () => {
        // Implement recovery logic based on error type
        switch (error.code) {
          case ResearchErrorCode.AI_SERVICE_UNAVAILABLE:
            await this.switchAIProvider();
            break;
            
          case ResearchErrorCode.DATABASE_CONNECTION_FAILED:
            await this.reconnectDatabase();
            break;
            
          default:
            throw error;
        }
      });
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
    }
  }

  private getCircuitBreaker(operation: string): CircuitBreaker {
    if (!this.circuitBreakers.has(operation)) {
      this.circuitBreakers.set(operation, new CircuitBreaker());
    }
    return this.circuitBreakers.get(operation)!;
  }

  private async switchAIProvider(): Promise<void> {
    // Implementation would switch to backup AI provider
    console.log('Switching to backup AI provider');
  }

  private async reconnectDatabase(): Promise<void> {
    // Implementation would reconnect to database
    console.log('Reconnecting to database');
  }

  onError(callback: (error: ResearchError) => void): () => void {
    this.errorCallbacks.add(callback);
    return () => this.errorCallbacks.delete(callback);
  }

  getErrorHistory(): ResearchError[] {
    return [...this.errorQueue];
  }

  clearErrorHistory(): void {
    this.errorQueue = [];
  }
}

// Utility functions for fallback services
async function switchToFallbackAIService(): Promise<void> {
  // Implementation would switch to backup AI service
  console.log('Switching to fallback AI service');
}

async function reinitializeDatabaseConnection(): Promise<void> {
  // Implementation would reinitialize database connection
  console.log('Reinitializing database connection');
}

// Hook for using error handling in components
export function useResearchErrorHandler() {
  const errorHandler = ResearchErrorHandler.getInstance();
  const [recentErrors, setRecentErrors] = useState<ResearchError[]>([]);

  useEffect(() => {
    const unsubscribe = errorHandler.onError((error) => {
      setRecentErrors(prev => [error, ...prev.slice(0, 9)]); // Keep last 10 errors
    });

    return unsubscribe;
  }, [errorHandler]);

  const reportError = useCallback((error: Error, operation: string, details?: any) => {
    const researchError = ResearchErrorFactory.createError(
      ResearchErrorCode.UNKNOWN_ERROR,
      error.message,
      operation,
      details
    );
    
    errorHandler.handleError(researchError);
  }, [errorHandler]);

  return {
    recentErrors,
    reportError,
    clearHistory: () => errorHandler.clearErrorHistory()
  };
}