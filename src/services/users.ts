import type { AdminUser, User, UserAdminUpdate, UserCreate, UserList } from '../types';
import { api } from './api';

const BASE = '/admin/users';

export async function listUsers(page: number, pageSize: number): Promise<UserList> {
  const { data } = await api.get<UserList>(BASE, { params: { page, page_size: pageSize } });
  return data;
}

export async function updateUserAdmin(id: string, payload: UserAdminUpdate): Promise<AdminUser> {
  const { data } = await api.patch<AdminUser>(`${BASE}/${id}`, payload);
  return data;
}

/** Cria um usuario comum pela rota de cadastro, que exige papel admin. */
export async function createUser(payload: UserCreate): Promise<User> {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
}
