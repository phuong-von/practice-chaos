import { test , expect } from '../fixtures/fixtures';

declare const process: {
    env: {
        DEMOQA_USER?: string;
        DEMOQA_PASS?: string;
    };
};

test.describe('TestCase', () => {
    test('TC1 - Search book with multiple results', async ({ booksPage }) => {
        await booksPage.open();
        await booksPage.searchBook('Design');
        await booksPage.expectSearchResultContains(/design/i);
    });

    test('TC2 - Delete book successfully', async ({ loginPage, profilePage, bookStoreApi }) => {
        const isbn = '9781449331818';
        const bookName = 'Learning JavaScript Design Patterns';

        // Login via API to get userId and token
        const { userId, token } = await bookStoreApi.login(
            process.env.DEMOQA_USER!,
            process.env.DEMOQA_PASS!
        );

        // GET all books from API, find the target book by isbn
        const books = await bookStoreApi.getBooks();
        const targetBook = books.find(b => b.isbn === isbn);
        expect(targetBook).toBeDefined();
        expect(targetBook!.title).toBe(bookName);

        // Add book to collection via API (no UI interaction)
        await bookStoreApi.addBookToCollection(userId, token, isbn);

        // Login via UI then verify book appears in profile and delete it
        await loginPage.open();
        await loginPage.login(process.env.DEMOQA_USER!, process.env.DEMOQA_PASS!);
        await loginPage.expectLoginSuccess(process.env.DEMOQA_USER!);

        await profilePage.open();
        await profilePage.expectBookInCollection(bookName);
        await profilePage.deleteBook(bookName);
        await profilePage.expectBookNotInCollection(bookName);
    });
});
