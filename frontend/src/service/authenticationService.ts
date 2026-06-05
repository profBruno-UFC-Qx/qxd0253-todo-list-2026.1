import { BASE_URL, apiFetch } from "./api";
import type { LoginResponse, User } from "../types";

export class AuthenticationService {
  async login(identifier: string, password: string): Promise<User> {
    const url = `${BASE_URL}/auth/local`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          identifier, 
          password
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "Login failed");
    }

    const loginResponse: LoginResponse = await response.json();
    
    // Store JWT before calling /users/me so apiFetch can use it
    localStorage.setItem('jwt', loginResponse.jwt);

    try {
      // Use apiFetch to get the full user with role populated
      const roleResult = await apiFetch<User>("/users/me?populate=role");

      localStorage.setItem('username', roleResult.username);
      localStorage.setItem('usernameId', roleResult.documentId);
      localStorage.setItem('role', roleResult.role.name);

      return roleResult;
    } catch (error) {
      // Rollback if getting the user fails
      localStorage.removeItem('jwt');
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('usernameId');
    localStorage.removeItem('role');
  }
}
