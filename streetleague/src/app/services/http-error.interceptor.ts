import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastService } from './toast.service';

/**
 * HTTP Error Interceptor
 * 
 * Handles:
 * 1. Centralized error handling
 * 2. Retry logic for failed requests
 * 3. Token refresh on 401 (if you add auth)
 * 4. Error transformation
 * 
 * Usage: Register in app.config.ts
 * 
 * {
 *   provide: HTTP_INTERCEPTORS,
 *   useClass: HttpErrorInterceptor,
 *   multi: true
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private toastService: ToastService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // Retry failed requests once before error handling
      retry(1),
      
      catchError((error: HttpErrorResponse) => {
        // Handle specific error codes
        switch (error.status) {
          case 0:
            return this.handle0Error();
          case 400:
            return this.handle400Error(error);
          case 401:
            return this.handle401Error(req, next);
          case 403:
            return this.handle403Error();
          case 404:
            return this.handle404Error(error);
          case 409:
            return this.handle409Error(error);
          case 500:
            return this.handle500Error(error);
          default:
            return this.handleGenericError(error);
        }
      })
    );
  }

  /**
   * 0 - Network error or CORS issue
   */
  private handle0Error(): Observable<never> {
    const message = 'Network error. Please check your internet connection.';
    this.toastService.error(message);
    return throwError(() => new Error(message));
  }

  /**
   * 400 - Bad Request / Validation Error
   */
  private handle400Error(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Bad request. Please check your input.';

    // Extract error details from ApiResponse wrapper
    if (error.error?.errors && Array.isArray(error.error.errors)) {
      errorMessage = error.error.errors.join('\n');
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    this.toastService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * 401 - Unauthorized / Token Expired
   * If you implement JWT auth, handle token refresh here
   */
  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<never> {
    const message = 'Session expired. Please login again.';
    this.toastService.error(message);

    // TODO: If implementing auth:
    // this.authService.logout();
    // this.router.navigate(['/login']);

    return throwError(() => new Error(message));
  }

  /**
   * 403 - Forbidden / Permission Denied
   */
  private handle403Error(): Observable<never> {
    const message = 'You do not have permission to perform this action.';
    this.toastService.error(message);
    return throwError(() => new Error(message));
  }

  /**
   * 404 - Not Found
   */
  private handle404Error(error: HttpErrorResponse): Observable<never> {
    let message = 'Resource not found.';

    if (error.error?.message) {
      message = error.error.message;
    }

    this.toastService.error(message);
    return throwError(() => new Error(message));
  }

  /**
   * 409 - Conflict (e.g., resource already exists)
   */
  private handle409Error(error: HttpErrorResponse): Observable<never> {
    let message = 'This action conflicts with existing data.';

    if (error.error?.message) {
      message = error.error.message;
    }

    this.toastService.error(message);
    return throwError(() => new Error(message));
  }

  /**
   * 500 - Internal Server Error
   */
  private handle500Error(error: HttpErrorResponse): Observable<never> {
    let message = 'Server error. Please try again later.';

    if (error.error?.message) {
      message = error.error.message;
    }

    this.toastService.error(message);
    console.error('Server error:', error);
    return throwError(() => new Error(message));
  }

  /**
   * Generic error handler for unmapped status codes
   */
  private handleGenericError(error: HttpErrorResponse): Observable<never> {
    let message = error.message || 'An unexpected error occurred.';

    // Try to extract from ApiResponse wrapper
    if (error.error?.message) {
      message = error.error.message;
    }

    if (error.error?.errors && Array.isArray(error.error.errors)) {
      message = error.error.errors.join('\n');
    }

    this.toastService.error(message);
    console.error('HTTP Error:', error);
    return throwError(() => new Error(message));
  }
}

// ============================================================================
// ALTERNATIVE: Request/Response Interceptor (Advanced)
// ============================================================================

/**
 * Optional: HTTP Request/Response Interceptor
 * 
 * Useful for:
 * - Adding auth tokens to requests
 * - Adding request IDs for tracing
 * - Transforming responses
 * - Logging
 */
@Injectable({
  providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add request ID for tracing
    const requestId = this.generateRequestId();
    req = req.clone({
      setHeaders: {
        'X-Request-ID': requestId
      }
    });

    return next.handle(req);
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// SUPPORT INTERFACES
// ============================================================================

/**
 * ApiResponse Interface - matches backend response format
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  errors: string[] | null;
  timestamp: string;
}
