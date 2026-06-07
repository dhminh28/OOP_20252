import { apiFetch } from './api';
import type { User } from '../types/user';

interface BackendUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: 'MEMBER' | 'ADMIN';
  avatar?: string | null;
  blocked: boolean;
}

export async function updateProfile(payload: {
  fullName: string;
  phone?: string;
  avatar?: string;
}): Promise<User> {
  const user = await apiFetch<BackendUser>('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

  return {
    id: String(user.id),
    name: user.fullName,
    email: user.email,
    phone: user.phone ?? undefined,
    role: user.role.toLowerCase() as User['role'],
    avatar: user.avatar ?? undefined,
    blocked: user.blocked,
  };
}
