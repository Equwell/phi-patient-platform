import { Injectable, signal } from '@angular/core';
import type { User } from '../types/user.type';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private readonly userSignal = signal<User | null>(null);

  readonly user = this.userSignal.asReadonly();

  setUser(user: User | null): void {
    this.userSignal.set(user);
  }

  updateUser(user: User | null): void {
    this.userSignal.set(user);
  }

  clearUser(): void {
    this.userSignal.set(null);
  }
} 