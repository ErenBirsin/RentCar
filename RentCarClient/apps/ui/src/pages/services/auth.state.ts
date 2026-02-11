import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthState {
  readonly token = signal<string | null>(this.#readToken());

  #readToken(): string | null {
    const stored = localStorage.getItem('response');
    if (!stored) return null;
    const normalized = stored.trim();
    if (!normalized) return null;
    if (normalized === 'null') return null;
    if (normalized === 'undefined') return null;
    return normalized;
  }

  setToken(token: string) {
    const normalized = (token ?? '').trim();
    if (!normalized || normalized === 'null' || normalized === 'undefined') {
      this.clear();
      return;
    }
    localStorage.setItem('response', normalized);
    this.token.set(normalized);
  }

  clear() {
    localStorage.removeItem('response');
    this.token.set(null);
  }
}
