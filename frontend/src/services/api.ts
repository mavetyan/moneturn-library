import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { Author, Book } from '../types';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Authors
  async getAuthors(): Promise<Author[]> {
    return this.request<Author[]>(API_ENDPOINTS.AUTHORS);
  }

  async getAuthor(id: number): Promise<Author> {
    return this.request<Author>(`${API_ENDPOINTS.AUTHORS}/${id}`);
  }

  async createAuthor(name: string): Promise<Author> {
    return this.request<Author>(API_ENDPOINTS.AUTHORS, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async updateAuthor(id: number, name: string): Promise<Author> {
    return this.request<Author>(`${API_ENDPOINTS.AUTHORS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteAuthor(id: number): Promise<void> {
    await this.request<void>(`${API_ENDPOINTS.AUTHORS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Books
  async getBooks(): Promise<Book[]> {
    return this.request<Book[]>(API_ENDPOINTS.BOOKS);
  }

  async getBook(id: number): Promise<Book> {
    return this.request<Book>(`${API_ENDPOINTS.BOOKS}/${id}`);
  }

  async createBook(title: string, authorId: number): Promise<Book> {
    return this.request<Book>(API_ENDPOINTS.BOOKS, {
      method: 'POST',
      body: JSON.stringify({ title, authorId }),
    });
  }

  async updateBook(id: number, title: string, authorId: number): Promise<Book> {
    return this.request<Book>(`${API_ENDPOINTS.BOOKS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, authorId }),
    });
  }

  async deleteBook(id: number): Promise<void> {
    await this.request<void>(`${API_ENDPOINTS.BOOKS}/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
