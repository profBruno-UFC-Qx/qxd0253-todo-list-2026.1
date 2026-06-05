import { BASE_URL } from "./api";
import type {
  Category,
  StrapiCollectionResponse,
} from "../types";

export class CategoryService {
  async getAll(): Promise<Category[]> {
    const url = `${BASE_URL}/categories`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
      }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result: StrapiCollectionResponse<Category> = await response.json();
    return result.data    
  }
}