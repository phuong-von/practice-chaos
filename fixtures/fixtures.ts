import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { BooksPage } from '../pages/BooksPage';
import { BookStoreApi } from '../api/BookStoreApi';

type MyFixtures = {
  loginPage: LoginPage;
  profilePage: ProfilePage;
  booksPage: BooksPage;
  bookStoreApi: BookStoreApi;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  booksPage: async ({ page }, use) => {
    await use(new BooksPage(page));
  },
  bookStoreApi: async ({ request }, use) => {
    await use(new BookStoreApi(request));
  },
});

export { expect } from '@playwright/test';
