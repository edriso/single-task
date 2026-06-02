import { expect, test } from '@playwright/test';

test('name one thing, focus, done, and the queue persists', async ({ page }) => {
  await page.goto('/');
  const heading = page.getByRole('heading', { name: /one thing/ });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('opacity', '1');

  await page.getByLabel('The one thing').fill('clear the inbox');
  await page.getByRole('button', { name: 'Queue for later' }).click();
  await expect(page.getByText(/After, maybe/)).toBeVisible();

  await page.reload();
  await expect(page.getByText('clear the inbox')).toBeVisible();

  await page.getByLabel('The one thing').fill('finish the draft');
  await page.getByRole('button', { name: 'Begin' }).click();
  await expect(page.getByText('the only thing right now')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'finish the draft' })).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByRole('heading', { name: 'Done.' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Next: clear the inbox/ })).toBeVisible();
});
