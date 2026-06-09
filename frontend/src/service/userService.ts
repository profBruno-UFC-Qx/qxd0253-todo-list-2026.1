import { ApiService } from "./api";
import type { Result, User } from "../types";

export class UserService {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async getMe(): Promise<Result<User>> {
    return await this.apiService.fetch<User>("/users/me?populate=role");
  }
}
