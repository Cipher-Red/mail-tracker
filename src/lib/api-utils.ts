/**
 * Utility functions for API requests
 */

/**
 * Handle API errors in a consistent way
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Try to get error details from the response
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
    } catch (e) {
      // If parsing fails, throw a generic error with status code
      throw new Error(`API error: ${response.status}`);
    }
  }
  
  return response.json() as Promise<T>;
}

/**
 * Create a fetch request with standard options
 */
export function createApiRequest(
  url: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Request {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  
  const options: RequestInit = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  return new Request(url, options);
}

/**
 * Fetch data from API with error handling
 */
export async function fetchFromApi<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const request = createApiRequest(url, method, body);
  const response = await fetch(request);
  return handleApiResponse<T>(response);
}
