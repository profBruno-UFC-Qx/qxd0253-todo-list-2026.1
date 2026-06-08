import { apiFetch } from "./api";
import type {
  Category,
  StrapiCollectionResponse,
  Result,
} from "../types";

export class CategoryService {
  async getAll(): Promise<Result<Category[]>> {
    const result = await apiFetch<StrapiCollectionResponse<Category>>("/categories");
    if (!result.success) return result;
    return { success: true, data: result.data.data };
  }
}
