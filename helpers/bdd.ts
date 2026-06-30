import { test } from '@playwright/test';

export async function given(title: string, action: () => Promise<void>) {
  await test.step(`GIVEN ${title}`, action);
}

export async function when(title: string, action: () => Promise<void>) {
  await test.step(`WHEN ${title}`, action);
}

export async function then(title: string, action: () => Promise<void>) {
  await test.step(`THEN ${title}`, action);
}

export async function and(title: string, action: () => Promise<void>) {
  await test.step(`AND ${title}`, action);
}