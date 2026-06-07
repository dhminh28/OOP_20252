export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

type ApiOptions = RequestInit & {
  token?: string | null;
  publicRequest?: boolean;
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
  const {
    token: explicitToken,
    publicRequest = false,
    ...requestOptions
  } = options;
  const token = publicRequest
    ? null
    : explicitToken === undefined
      ? localStorage.getItem('token')
      : explicitToken;
  const headers = new Headers(requestOptions.headers);

  if (
    !headers.has('Content-Type') &&
    requestOptions.body &&
    !(requestOptions.body instanceof FormData)
  ) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
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

export async function apiFetchBlob(path: string): Promise<Blob> {
  const token = localStorage.getItem('token');
  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { headers });
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }
  if (!response.ok) {
    const payload = await parseJson(response);
    throw new ApiError(getErrorMessage(payload, response.status), response.status);
  }
  return response.blob();
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
  let message = '';

  if (isApiEnvelope<unknown>(payload) && payload.message) {
    message = payload.message;
  } else if (payload && typeof payload === 'object' && 'message' in payload) {
    message = String((payload as { message?: unknown }).message);
  }

  if (/insufficient.*balance|balance.*insufficient/i.test(message)) {
    return 'Số dư ví không đủ để thực hiện giao dịch.';
  }
  if (/already booked|booking conflict|time slot|conflict/i.test(message)) {
    return 'Khung giờ này đã có người đặt. Vui lòng chọn thời gian khác.';
  }
  if (/not found/i.test(message)) {
    return 'Không tìm thấy dữ liệu được yêu cầu.';
  }
  if (/bad credentials|invalid.*(password|credential)|incorrect.*password/i.test(message)) {
    return 'Địa chỉ thư điện tử hoặc mật khẩu không chính xác.';
  }

  const statusMessages: Record<number, string> = {
    400: 'Dữ liệu gửi lên không hợp lệ.',
    401: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    403: 'Bạn không có quyền thực hiện thao tác này.',
    404: 'Không tìm thấy dữ liệu được yêu cầu.',
    409: 'Dữ liệu bị xung đột. Vui lòng kiểm tra và thử lại.',
    500: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
  };

  return statusMessages[status] ?? (message || `Yêu cầu không thành công (mã lỗi ${status}).`);
}
