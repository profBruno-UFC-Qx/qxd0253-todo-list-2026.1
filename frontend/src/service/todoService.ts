import { apiFetch } from "./api";
import type {
  Todo,
  StrapiCollectionResponse,
  StrapiSingleResponse,
  Result,
} from "../types";

export class TodoService {
  async getAll(): Promise<Result<Todo[]>> {
    const userId = localStorage.getItem('userId');
    const result = await apiFetch<StrapiCollectionResponse<Todo>>(
      `/tasks?populate[0]=category&populate[1]=owner&filters[owner][documentId][$eq]=${userId}`
    );
    if (!result.success) return result;
    return { success: true, data: result.data.data };
  }

  async create({
    description,
    category,
    done,
    deadline,
  }: Omit<Todo, "id" | "documentId">): Promise<Result<Todo>> {
    const result = await apiFetch<StrapiSingleResponse<Omit<Todo, "category">>>("/tasks", {
      method: "POST",
      body: JSON.stringify({
        data: {
          description,
          category: category.documentId,
          done,
          deadline: deadline || null,
        },
      }),
    });

    if (!result.success) return result;
    return { success: true, data: { ...result.data.data, category } };
  }

  async delete(id: string): Promise<Result<void>> {
    const result = await apiFetch<void>(`/tasks/${id}`, {
      method: "DELETE",
    });
    
    if (!result.success) return result;
    return { success: true, data: undefined as any };
  }

  async update(task: Todo): Promise<Result<Todo>> {
    const body = {
      data: {
        description: task.description,
        category: task.category.documentId,
        done: task.done,
        deadline: task.deadline || null,
      },
    };

    const result = await apiFetch<StrapiSingleResponse<Omit<Todo, "category">>>(
      `/tasks/${task.documentId}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    if (!result.success) return result;
    return { success: true, data: { ...result.data.data, category: task.category } };
  }
}
