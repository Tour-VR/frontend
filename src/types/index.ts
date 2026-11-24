// Aliases legiveis dos tipos gerados do OpenAPI (`npm run gen:types`).
// Nao escreva interface de contrato a mao: regenere `api.d.ts` quando o backend mudar.
import type { components } from './api';

type Schemas = components['schemas'];

export type User = Schemas['UserMeResponse'];
export type AuthResponse = Schemas['TokenResponse'];
export type LoginPayload = Schemas['UserLogin'];
export type Point = Schemas['PointAdminResponse'];
export type PointCreate = Schemas['PointCreate'];
export type PointUpdate = Schemas['PointUpdate'];
export type PointStatus = Point['status'];
export type MediaItem = Schemas['MediaItemResponse'];
export type MediaItemInput = Schemas['MediaItemInput'];
export type PointConnection = Schemas['PointConnectionSchema'];
export type MediaUpload = Schemas['MediaUploadResponse'];
export type MetricsOverview = Schemas['MetricsOverviewResponse'];
export type AdminUser = Schemas['UserAdminResponse'];
export type UserList = Schemas['UserListResponse'];
export type UserAdminUpdate = Schemas['UserAdminUpdate'];
export type UserRole = NonNullable<UserAdminUpdate['role']>;
export type UserUpdateMe = Schemas['UserUpdateMe'];
export type UserChangePassword = Schemas['UserChangePassword'];
export type UserCreate = Schemas['UserCreate'];
export type MessageResponse = Schemas['MessageResponse'];
