import type { User } from "../types";

export class SessionService {
  saveSession(jwt: string, user: User): void {
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('username', user.username);
    localStorage.setItem('userId', user.documentId);
    if (user.role) {
      localStorage.setItem('role', user.role.name);
    }
  }

  clearSession(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
