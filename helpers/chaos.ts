import { Page, Route } from '@playwright/test';


/**
 * Chặn toàn bộ image request từ network.
 * Bao gồm cả ảnh URL thường và data:image (base64).
 */



export async function blockAllImages(page: Page) {
  // 1) Block tất cả network request có resource type là image
  await page.route('**/*', (route: Route) => {
    const type = route.request().resourceType();

    if (type === 'image') {
      return route.abort();
    }

    return route.continue();
  });

  // 2) Block fake URL dùng để biến data:image thành broken image
  await page.route('https://broken.invalid/**', route => route.abort());

  // 3) Override src setter của HTMLImageElement
  // Nếu app set data:image..., đổi nó sang URL giả để nó bị abort
  await page.addInitScript(() => {
    const desc = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      'src'
    );

    if (!desc?.set || !desc?.get) return;

    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      enumerable: desc.enumerable ?? true,
      get() {
        return desc.get!.call(this);
      },
      set(value: string) {
        if (typeof value === 'string' && value.startsWith('data:image')) {
          desc.set!.call(this, 'https://broken.invalid/img.jpg');
        } else {
          desc.set!.call(this, value);
        }
      }
    });
  });
}

/**
 * Random fail image requests theo tỷ lệ failureRate
 * Ví dụ 0.5 = fail 50%
 */
export async function randomlyFailImages(page: Page, failureRate = 0.5) {
  await page.route('**/*', (route: Route) => {
    const request = route.request();

    if (request.resourceType() === 'image' && Math.random() < failureRate) {
      return route.abort();
    }

    return route.continue();
  });
}

/**
 * Làm chậm image requests để test loading/skeleton/layout
 */
export async function slowDownImages(page: Page, delayMs = 3000) {
  await page.route('**/*', async (route: Route) => {
    const request = route.request();

    if (request.resourceType() === 'image') {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    return route.continue();
  });
}

/**
 * Force API fail bằng abort
 */
export async function failApi(page: Page, apiPattern: string | RegExp) {
  await page.route(apiPattern, route => route.abort());
}

/**
 * Mock API trả data lỗi / thiếu field
 */
export async function mockBrokenBooksApi(
  page: Page,
  apiPattern: string | RegExp
) {
  await page.route(apiPattern, route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1,
          title: null,
          image: '',
          author: 'Unknown'
        },
        {
          id: 2,
          badField: 'oops'
        }
      ])
    });
  });
}

/**
 * Check 1 image có broken không
 */
export async function isImageBroken(page: Page,selector: string): Promise<boolean> {
  const img = page.locator(selector).first();
  await img.waitFor({ state: 'attached' });

  return await img.evaluate((el: HTMLImageElement) => {
    return el.complete && el.naturalWidth === 0;
  });
}