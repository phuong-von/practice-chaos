import { APIRequestContext, expect } from '@playwright/test';

interface Book {
  isbn: string;
  title: string;
  [key: string]: unknown;
}

export class BookStoreApi {
  constructor(private request: APIRequestContext) {}

  async login(userName: string, password: string): Promise<{ userId: string; token: string }> {
    const response = await this.request.post('https://demoqa.com/Account/v1/Login', {
      data: { userName, password },
    });
    await expect(response).toBeOK();
    const body = await response.json();
    return { userId: body.userId, token: body.token };
  }

  async getBooks(): Promise<Book[]> {
    const response = await this.request.get('https://demoqa.com/BookStore/v1/Books');
    await expect(response).toBeOK();
    const body = await response.json();
    return body.books as Book[];
  }

  async addBookToCollection(userId: string, token: string, isbn: string): Promise<void> {
    const response = await this.request.post('https://demoqa.com/BookStore/v1/Books', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        userId,
        collectionOfIsbns: [{ isbn }],
      },
    });
    await expect(response).toBeOK();
  }
}
