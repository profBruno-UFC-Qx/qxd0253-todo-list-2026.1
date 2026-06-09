import { ApiService } from "./api";
import type {
  Category,
  StrapiCollectionResponse,
  Result,
} from "../types";

export class CategoryService {
  private apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async getAll(): Promise<Result<Category[]>> {
    const result = await this.apiService.fetch<StrapiCollectionResponse<Category>>("/categories");
    if (!result.success) return result;
    return { success: true, data: result.data.data };
  }
}
