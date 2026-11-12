// Aliases legiveis dos tipos gerados do OpenAPI (`npm run gen:types`).
// Nao escreva interface de contrato a mao: regenere `api.d.ts` quando o backend mudar.
import type { components } from './api';

type Schemas = components['schemas'];

export type User = Schemas['UserMeResponse'];
export type AuthResponse = Schemas['TokenResponse'];
export type LoginPayload = Schemas['UserLogin'];
