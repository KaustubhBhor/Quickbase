import { test, chromium } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'
import path from 'path';

const isRunningAlone = process.argv.some(arg =>
  arg.endsWith(path.basename(__filename))
);

test.describe('Conditional block -> runs Storage state only explicitly', () => {
  if (!isRunningAlone) {
    test.skip();
  }

  test('Storage state',async () => {
    const browser = await chromium.launch({
      headless: false, // show browser for manual login
      slowMo: 50,
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.pause();
    //await loginPage.login();
    await context.storageState({ path: 'storageState.json' });
    await browser.close();
    console.log('storageState.json generated successfully.');
  });
});