import {test, expect} from '../fixtures/fixtures';
import { blockAllImages, isImageBroken } from '../helpers/chaos';

test.describe('ChaosTest', () => {
    // test('CT1 - Hien thi loi khi API search tra ve 500', async ({ page, booksPage }) => {
    //     let callCount = 0;

    //     await page.route('**/BookStore/v1/Books', async route => {
    //         callCount++;
    //         if (callCount === 1) {
    //             await route.continue(); // lan 1: cho qua binh thuong
    //         } else {
    //             await route.fulfill({   // lan 2 tro di: tra ve 500
    //                 status: 500,
    //                 body: JSON.stringify({ error: 'Internal Server Error' })
    //             });
    //         }
    //     });

    //     // AND: User open search page
    //     await booksPage.open();
    //     await page.getByPlaceholder('Type to search').fill('Design');

    //     //THEN: Book list van search duoc binh thuong, khong crash
    //     /*
    //     await expect(page.getByText(/error|something went wrong/i)).toBeVisible();
    //     await expect(page).not.toHaveURL(/error|crash/i);
    //     */
    //    await expectSearchResultContains(/design/i);
    // });

    // test('CT2 - Anh bia bi broken khi tat ca request anh that bai', async ({ page, booksPage }) => {

    //     // 1. Block network request anh co duoi file (jpg, png, webp...)
    //     await page.route('**/*.{jpg,jpeg,png,gif,webp,svg}', route => route.abort());

    //     // 2. Block placeholder URL dung cho base64 images (xu ly o buoc 3)
    //     await page.route('https://broken.invalid/**', route => route.abort());

    //     // 3. Intercept base64/data URI images TRUOC khi React render:
    //     //    Override HTMLImageElement.src setter - thay data URI bang URL se bi abort o buoc 2
    //     await page.addInitScript(() => {
    //         const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src')!;
    //         Object.defineProperty(HTMLImageElement.prototype, 'src', {
    //             set(value: string) {
    //                 if (typeof value === 'string' && value.startsWith('data:image')) {
    //                     desc.set!.call(this, 'https://broken.invalid/img.jpg');
    //                 } else {
    //                     desc.set!.call(this, value);
    //                 }
    //             },
    //             get() { return desc.get!.call(this); }
    //         });
    //     });

    //     // AND - Mo trang sau khi da setup tat ca intercept
    //     await booksPage.open();

    //     // THEN - Book list van hien thi day du, khong crash
    //     await expect(page.getByRole('link').first()).toBeVisible();

    //     // THEN - Anh bia bi broken (naturalWidth = 0 khi request fail)
    //     const firstImg = page.locator('img').first();
    //     await expect(firstImg).toBeAttached();
    //     const isBroken = await firstImg.evaluate(
    //         (img: HTMLImageElement) => img.complete && img.naturalWidth === 0
    //     );
    //     expect(isBroken).toBe(true);
    // });


test('CT01 - Anh bia bi broken khi tat ca request anh that bai', async ({ page, booksPage }) => {
  // GIVEN
  await blockAllImages(page);

  // WHEN
  await booksPage.open();

  // THEN
  await expect(page.locator('.books-wrapper')).toBeVisible();
  await expect(page.locator('.books-wrapper a').first()).toBeVisible();

  const broken = await isImageBroken(page,'.books-wrapper img[alt="book-image"]'
  );

  expect(broken).toBe(true);
});





});
