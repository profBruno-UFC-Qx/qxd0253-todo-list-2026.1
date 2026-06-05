import { apiFetch } from "./api";
import type {
  Todo,
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from "../types";

export class TodoService {
  async getAll(): Promise<Todo[]> {
    const usernameId = localStorage.getItem('usernameId');
    const result = await apiFetch<StrapiCollectionResponse<Todo>>(
      `/tasks?populate[0]=category&populate[1]=owner&filters[owner][documentId][$eq]=${usernameId}`
    );
    return result.data;
  }

  async create({
    description,
    category,
    done,
    deadline,
  }: Omit<Todo, "id" | "documentId">): Promise<Todo> {
    const strapiResponse = await apiFetch<StrapiSingleResponse<Omit<Todo, "category">>>("/tasks", {
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

    return { ...strapiResponse.data, category };
  }

  async delete(id: string): Promise<void> {
    await apiFetch(`/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async update(task: Todo): Promise<Todo> {
    const body = {
      data: {
        description: task.description,
        category: task.category.documentId,
        done: task.done,
        deadline: task.deadline || null,
      },
    };

    const strapiResponse = await apiFetch<StrapiSingleResponse<Omit<Todo, "category">>>(
      `/tasks/${task.documentId}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return { ...strapiResponse.data, category: task.category };
  }
}
