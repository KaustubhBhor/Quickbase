import { Page } from '@playwright/test';

export class AppSettingsPage {
  readonly page: Page;

  appSettingsButton = 'text=App Settings';
  tablesNavButton = '#appSettingsNav_tables';

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToTables() {
    await this.page.waitForLoadState('networkidle');
    await this.page.click(this.appSettingsButton);
    await this.page.click(this.tablesNavButton);
    await this.page.waitForLoadState('networkidle');
  }
}
