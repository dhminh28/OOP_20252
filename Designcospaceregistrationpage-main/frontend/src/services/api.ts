const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

type ApiOptions = RequestInit & {
  token?: string | null;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = options.token ?? localStorage.getItem('token');
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  const payload = response.status === 204 ? null : await parseJson(response);

  if (!response.ok) {
    const message = getErrorMessage(payload, response.status);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (isApiEnvelope<T>(payload)) {
    return payload.data;
  }

  return payload as T;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function isApiEnvelope<T>(payload: unknown): payload is ApiEnvelope<T> {
  return Boolean(
    payload &&
      typeof payload === 'object' &&
      'success' in payload &&
      'message' in payload &&
      'data' in payload,
  );
}

function getErrorMessage(payload: unknown, status: number) {
  if (isApiEnvelope<unknown>(payload) && payload.message) {
    return payload.message;
  }

  if (payload && typeof payload === 'object' && 'message' in payload) {
    return String((payload as { message?: unknown }).message);
  }

  return `API request failed: ${status}`;
}
