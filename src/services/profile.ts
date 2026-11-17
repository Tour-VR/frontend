import type { MessageResponse, User, UserChangePassword, UserUpdateMe } from '../types';
import { api } from './api';

export async function updateMe(payload: UserUpdateMe): Promise<User> {
  const { data } = await api.put<User>('/users/me', payload);
  return data;
}

export async function changeMyPassword(payload: UserChangePassword): Promise<MessageResponse> {
  const { data } = await api.put<MessageResponse>('/users/me/password', payload);
  return data;
}
