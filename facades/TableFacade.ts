import { Page } from '@playwright/test';
import { AppSettingsPage } from '../pages/AppSettingsPage';
import { TablesPage } from '../pages/TablesPage';

export class TableFacade {
  readonly page: Page;
  readonly appSettingsPage: AppSettingsPage;
  readonly tablesPage: TablesPage;

  constructor(page: Page) {
    this.page = page;
    this.appSettingsPage = new AppSettingsPage(page);
    this.tablesPage = new TablesPage(page);
  }

  async createTableIfNotExists(tableName: string, description: string) {
    await this.tablesPage.searchTable(tableName);
    const tableRows = await this.page.locator('//tr[@role="row"]/td/a').allTextContents();
    if (tableRows.includes(tableName)) {
      return false; // Table already exists
    }
    await this.tablesPage.openNewTableMenu();
    await this.tablesPage.selectNewTableOption();
    await this.tablesPage.expectNewTableModal();
    await this.tablesPage.openRecommendations();
    await this.tablesPage.selectTableByName(tableName);
    await this.tablesPage.selectFirstSuggestedIcon();
    await this.tablesPage.setTableDescription(description);
    await this.tablesPage.createTable();
    return true; // Table created
  }

  async deleteTable(tableName: string) {
    await this.tablesPage.clickDeleteIcon(tableName);
    await this.tablesPage.expectDeletePopup();
    await this.tablesPage.confirmDeleteTable();
  }
}
