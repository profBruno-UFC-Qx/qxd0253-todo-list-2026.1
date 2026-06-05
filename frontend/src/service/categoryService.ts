import { apiFetch } from "./api";
import type {
  Category,
  StrapiCollectionResponse,
} from "../types";

export class CategoryService {
  async getAll(): Promise<Category[]> {
    const result = await apiFetch<StrapiCollectionResponse<Category>>("/categories");
    return result.data;
  }
}
