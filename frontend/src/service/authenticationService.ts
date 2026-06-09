import { ApiService } from "./api";
import type { LoginResponse, User, Result } from "../types";
import { SessionService } from "./sessionService";

export class AuthenticationService {
  private apiService: ApiService;
  private sessionService: SessionService;

  constructor(apiService: ApiService, sessionService: SessionService) {
    this.apiService = apiService;
    this.sessionService = sessionService;
  }

  async login(identifier: string, password: string): Promise<Result<User>> {
    this.logout()
    const authResult = await this.authenticate(identifier, password);
    
    if (!authResult.success) {
      return authResult;
    }

    const userResult = await this.fetchUserDetails(authResult.data.jwt);
    
    if (!userResult.success) {
      this.logout();
      return userResult;
    }

    this.sessionService.saveSession(authResult.data.jwt, userResult.data);

    return { success: true, data: userResult.data };
  }

  private async authenticate(identifier: string, password: string): Promise<Result<LoginResponse>> {
    return await this.apiService.fetch<LoginResponse>("/auth/local", {
      method: "POST",
      body: JSON.stringify({ identifier, password })
    });
  }

  private async fetchUserDetails(token: string): Promise<Result<User>> {
    return await this.apiService.fetch<User>("/users/me?populate=role", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  logout(): void {
    this.sessionService.clearSession();
  }
}
