import { BASE_URL } from "./api";
import type {
  Todo,
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from "../types";

export class TodoService {
  async getAll(): Promise<Todo[]> {
    const url = `${BASE_URL}/tasks?populate[0]=category&populate[1]=owner&filters[owner][documentId][$eq]=${localStorage.getItem('usernameId')}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
      }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result: StrapiCollectionResponse<Todo> = await response.json();
    return result.data;
  }

  async create({
    description,
    category,
    done,
    deadline,
  }: Omit<Todo, "id" | "documentId">): Promise<Todo> {
    const url = `${BASE_URL}/tasks/`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          description,
          category: category.documentId,
          done,
          deadline: deadline || null,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const strapiResponse: StrapiSingleResponse<Omit<Todo, "category">> =
      await response.json();
    return { ...strapiResponse.data, category };
  }

  async delete(id: string) {
    const url = `${BASE_URL}/tasks/${id}`;

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
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

    const url = `${BASE_URL}/tasks/${task.documentId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const strapiResponse: StrapiSingleResponse<Omit<Todo, "category">> =
      await response.json();
    return { ...strapiResponse.data, ...{ category: task.category } };
  }
}
