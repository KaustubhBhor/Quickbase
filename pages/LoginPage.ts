import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  url = 'https://team.quickbase.com/nav/app/bvd4mrkt6/action/appoverview';
  usernameInput = 'input[name="username"]';
  passwordInput = 'input[name="password"]';
  submitButton = 'button[type="submit"]';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async login() {
    const username = process.env.USERNAME || '';
    const password = process.env.PASSWORD || '';
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitButton);
    await this.page.waitForLoadState('networkidle');
  }
}
