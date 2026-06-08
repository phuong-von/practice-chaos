import { test, expect } from '../fixtures/fixtures';

declare const process: {
    env: {
        DEMOQA_USER?: string;
        DEMOQA_PASS?: string;
    };
};

test.describe('TestCase', () => {
    test('TC1 - Search book with multiple results', async ({ page }) => {
        await page.goto('https://demoqa.com/books');
        await page.getByPlaceholder(/type to search/i).fill('Design');
        await expect(page.getByRole('link', { name: /design/i }).first()).toBeVisible();
    });

    test('TC2 - Delete book successfully', async ({ page, loginPage }) => {
        await loginPage.open();
        await loginPage.login(process.env.DEMOQA_USER!, process.env.DEMOQA_PASS!);
        await loginPage.expectLoginSuccess(process.env.DEMOQA_USER!);

        await page.goto('https://demoqa.com/books');
        //page.on('dialog', dialog => dialog.accept());

        await page.getByPlaceholder(/type to search/i).fill('Design');
        await page.getByRole('link', { name: 'Learning JavaScript Design Patterns' }).click();
        await page.getByRole('button', { name: 'Add To Your Collection' }).click();

        await page.goto('https://demoqa.com/profile');

        const bookRow = page.getByRole('row').filter({ hasText: 'Learning JavaScript Design Patterns' });
        await bookRow.locator('span[title="Delete"]').click();
        await page.getByRole('button', { name: 'OK', exact: true }).click();

        await expect(bookRow).toHaveCount(0);
    });
});
