export type Category = {
  documentId: string,
  description: string,
}

export type Todo = {
  id: number,
  documentId: string,
  category: Category,
  description: string,
  deadline?: string
  done: boolean
}

export type StrapiCollectionResponse<T> = {
  data: T[]
  meta: {
    pagination: {
      page: number,
      pageSize: number,
      pageCount: number,
      total: number
    }
  }
}

export type StrapiSingleResponse<T> = {
  data: T
  meta: {
    pagination: {
      page: number,
      pageSize: number,
      pageCount: number,
      total: number
    }
  }
}

export type UserRole = {
  id: number;
  name: string;
  description: string;
  type: string;
}

export type User = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  role: UserRole;
}

export type LoginResponse = {
  jwt: string;
  user: User;
}


