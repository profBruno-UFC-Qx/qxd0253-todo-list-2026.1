import { BASE_URL, apiFetch } from "./api";
import type { LoginResponse, User, Result } from "../types";

export class AuthenticationService {
  async login(identifier: string, password: string): Promise<Result<User>> {
    const url = `${BASE_URL}/auth/local`;
    
    try {
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
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = {};
        }
        return {
          success: false,
          error: {
            message: errorData.error?.message || "Login failed",
            status: response.status,
            details: errorData
          }
        };
      }

      const loginResponse: LoginResponse = await response.json();
      localStorage.setItem('jwt', loginResponse.jwt);

      const roleResult = await apiFetch<User>("/users/me?populate=role");

      if (!roleResult.success) {
        localStorage.removeItem('jwt');
        return roleResult;
      }

      localStorage.setItem('username', roleResult.data.username);
      localStorage.setItem('usernameId', roleResult.data.documentId);
      localStorage.setItem('role', roleResult.data.role.name);

      return { success: true, data: roleResult.data };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('usernameId');
    localStorage.removeItem('role');
  }
}
