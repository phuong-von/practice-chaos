import { test, expect } from '../fixtures/fixtures';
import { given, when, then, and } from '../helpers/bdd';
import {
  blockAllImages,
  randomlyFailImages,
  slowDownImages,
  failApi,
  mockBrokenBooksApi,
  isImageBroken
} from '../helpers/chaos';

test.describe('Books page - Chaos / Fault Injection', () => {

  test('CT01 - should keep book list visible when all cover image requests fail', async ({page,booksPage}) => {
    const bookList = page.locator('.books-wrapper');
    const firstBookLink = page.locator('.books-wrapper a').first();
    const firstBookImageSelector = '.books-wrapper img[alt="book-image"]';

    await given('all cover image requests are blocked', async () => {
      await blockAllImages(page);
    });

    await when('user opens the Books page', async () => {
      await booksPage.open();
    });

    await then('the book list should still be visible', async () => {
      await expect(bookList).toBeVisible();
      await expect(firstBookLink).toBeVisible();
    });

    await and('the first book cover image should be broken', async () => {
      expect(await isImageBroken(page, firstBookImageSelector)).toBe(true);
    });
  });

  test('CT02 - should remain usable when some cover images fail randomly', async ({
    page,
    booksPage
  }) => {
    const bookList = page.locator('.books-wrapper');
    const firstBookLink = page.locator('.books-wrapper a').first();

    await given('some cover image requests fail randomly', async () => {
      await randomlyFailImages(page, 0.5);
    });

    await when('user opens the Books page', async () => {
      await booksPage.open();
    });

    await then('the book list should still be visible', async () => {
      await expect(bookList).toBeVisible();
    });

    await and('the page should remain usable', async () => {
      await expect(firstBookLink).toBeVisible();
      await expect(page.locator('body')).toBeVisible();
    });
  });

  test('CT03 - should keep page stable when cover images load slowly', async ({
    page,
    booksPage
  }) => {
    const bookList = page.locator('.books-wrapper');

    await given('cover images are loading slowly', async () => {
      await slowDownImages(page, 4000);
    });

    await when('user opens the Books page', async () => {
      await booksPage.open();
    });

    await then('the book list should still render', async () => {
      await expect(bookList).toBeVisible();
    });

    await and('the page should not crash while waiting for images', async () => {
      await expect(page.locator('body')).toBeVisible();
    });
  });

//   test('CT04 - should show error or fallback state when books API fails', async ({
//     page,
//     booksPage
//   }) => {

//     await given('the books API request fails', async () => {
//       await failApi(page, '**/api/books');
//     });

//     await when('user opens the Books page', async () => {
//       await booksPage.open();
//     });

//     await then('an error or fallback state should be displayed', async () => {
//       await expect(
//         page.getByText(/error|failed|something went wrong|khong the tai|không thể tải/i)
//       ).toBeVisible();
//     });
//   });

  test('CT05 - should not crash when books API returns invalid data', async ({
    page,
    booksPage
  }) => {

    await given('the books API returns invalid or incomplete data', async () => {
      await mockBrokenBooksApi(page, '**/api/books');
    });

    await when('user opens the Books page', async () => {
      await booksPage.open();
    });

    await then('the page should not crash', async () => {
      await expect(page.locator('body')).toBeVisible();
    });

    await and('the UI should remain usable', async () => {
      await expect(page.locator('.books-wrapper')).toBeVisible();
    });
  });
});
