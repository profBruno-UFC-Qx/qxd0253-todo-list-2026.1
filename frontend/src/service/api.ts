import type { Result } from "../types";
import { SessionService } from "./sessionService";

export const BASE_URL = "http://localhost:1337/api";

export class ApiService {
  private sessionService: SessionService;

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<Result<T>> {
    const token = this.sessionService.getToken();
    
    const headers = new Headers(options.headers || {});
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    if (!headers.has("Content-Type") && options.body && typeof options.body === 'string') {
      headers.set("Content-Type", "application/json");
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let details;
        try {
          details = await response.json();
        } catch (e) {
          details = {}
        }
        return {
          success: false,
          error: {
            message: `API Error: ${response.status} - ${response.statusText}`,
            status: response.status,
            details: details?.error || details,
          },
        };
      }

      if (response.status === 204) {
        return { success: true, data: null as any };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, 
        error: {
          message: error.message || "Network" 
        } 
      }
    }
  }
}
