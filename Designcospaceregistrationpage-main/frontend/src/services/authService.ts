import { apiFetch } from './api';
import type { User } from '../types/user';

interface BackendUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: 'MEMBER' | 'ADMIN';
}

interface BackendAuthResponse {
  user: BackendUser;
  token: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const response = await apiFetch<BackendAuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  return {
    user: mapUser(response.user),
    token: response.token,
  };
}

export async function register(payload: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthResult> {
  const response = await apiFetch<BackendAuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    user: mapUser(response.user),
    token: response.token,
  };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function mapUser(user: BackendUser): User {
  return {
    id: String(user.id),
    name: user.fullName,
    email: user.email,
    phone: user.phone ?? undefined,
    role: user.role.toLowerCase() as User['role'],
  };
}
