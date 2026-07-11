import { ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export function success<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return { success: true, data, meta }
}

export function error(code: string, message: string): ApiResponse<never> {
  return { success: false, error: { code, message } }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
}

export async function apiClient<T>(
  method: string,
  url: string,
  body?: any,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const fetchOptions: RequestInit = {
      method,
      ...options,
    };

    if (body) {
      if (body instanceof FormData) {
        fetchOptions.body = body;
      } else {
        fetchOptions.body = JSON.stringify(body);
      }
    }

    const response = await fetchWithAuth(url, fetchOptions);
    
    // Handle 204 No Content
    if (response.status === 204) {
      return success(null as unknown as T);
    }
    
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errCode = data?.error?.code || data?.code || 'API_ERROR';
      const errMsg = data?.error?.message || data?.message || response.statusText;
      return error(errCode, errMsg);
    }

    // Sometimes data is nested like { success: true, data: ... } from the NestJS interceptor
    if (data && data.success === true && data.data !== undefined) {
      return success(data.data, data.meta);
    }

    return success(data !== null ? data : null);
  } catch (err: any) {
    return error('NETWORK_ERROR', err.message || 'Failed to connect to the server');
  }
}

// Keeping withMockApi temporarily exported just in case some services still use it while we transition
export async function withMockApi<T>(
  operation: () => Promise<T> | T,
  errorCode?: string,
  errorMessage?: string,
  delayMs?: number
): Promise<ApiResponse<T>> {
  try {
    const time = delayMs ?? 500;
    await new Promise((resolve) => setTimeout(resolve, time));
    const result = await operation();
    return success(result);
  } catch (err: any) {
    return error(errorCode || 'INTERNAL_ERROR', errorMessage || err.message || 'Unknown error');
  }
}
