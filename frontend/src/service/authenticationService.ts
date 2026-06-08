import { BASE_URL, apiFetch } from "./api";
import type { LoginResponse, User, Result } from "../types";

export class AuthenticationService {
  async login(identifier: string, password: string): Promise<Result<User>> {
    const authResult = await this.authenticate(identifier, password);
    
    if (!authResult.success) {
      return authResult;
    }

    this.saveToken(authResult.data.jwt);

    const userResult = await this.fetchUserDetails();
    
    if (!userResult.success) {
      this.logout();
      return userResult;
    }

    this.saveUserData(userResult.data);

    return { success: true, data: userResult.data };
  }

  private async authenticate(identifier: string, password: string): Promise<Result<LoginResponse>> {
    const url = `${BASE_URL}/auth/local`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      });

      if (!response.ok) {
        return await this.handleAuthError(response);
      }

      const loginResponse: LoginResponse = await response.json();
      return { success: true, data: loginResponse };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  private async handleAuthError(response: Response): Promise<Result<any>> {
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

  private async fetchUserDetails(): Promise<Result<User>> {
    return await apiFetch<User>("/users/me?populate=role");
  }

  private saveToken(jwt: string): void {
    localStorage.setItem('jwt', jwt);
  }

  private saveUserData(user: User): void {
    localStorage.setItem('username', user.username);
    localStorage.setItem('userId', user.documentId);
    if (user.role) {
      localStorage.setItem('role', user.role.name);
    }
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }
}
