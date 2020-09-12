import { InjectionToken } from '@angular/core';

export interface UserToken {
  id: string;
  auth_token: string;
  email: string;
  expires_in: number;
}

export const WINDOW = new InjectionToken<Window>('window', {
  factory: () => window,
  providedIn: 'root',
});
