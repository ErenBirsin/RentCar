import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthState {
  readonly token = signal<string | null>(localStorage.getItem('response'));

  setToken(token: string) {
    localStorage.setItem('response', token);
    this.token.set(token);
  }

  clear() {
    localStorage.removeItem('response');
    this.token.set(null);
  }
}
