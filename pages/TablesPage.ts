import { Page } from '@playwright/test';

export class TablesPage {
  readonly page: Page;
  newTableMenuButton = '#newTableMenuButton';
  btnNewTableAppTables = '#btnNewTableAppTables';
  newTableDialogTitle = '#newTableDialogTitle';
  recommendationsButton = '#recommendationsButton';
  firstSuggestedIcon = 'xpath=(//*[starts-with(@class, "qbIcon iconTable-")])[2]';
  tableDescriptionInput = '[data-test-id="TableDescription"]';
  createTableButton = '[data-test-id="dialogOkButton"]';
  deletePopupTitle = '#dialogDeleteTable .ui-dialog-title';
  searchBox = '#tablesSearch';
  typeYesField = '#typeYesField';
  deleteTableButton = 'button:has-text("Delete Table")';

  getTableNameFromRecommendations(text: string) {
    return `//button[text()="${text}"]`;
  }
  
  getDeleteIconLocator(tableName: string) {
    return `(//tr[@role="row"]/td/a[text()="${tableName}"]/ancestor::tr)[2]//a[@class="RowAction Delete Icon"]`;
  }
  
  getMoveTableIcon(tableName: string){
    return `//tr[@role="row"]/td/a[text()="${tableName}"]/../..//a[@class="RowAction Move Icon"]`;
  }
  
  constructor(page: Page) {
    this.page = page;
  }

  async openNewTableMenu() {
    await this.page.click(this.newTableMenuButton);
  }

  async selectNewTableOption() {
    await this.page.click(this.btnNewTableAppTables);
  }

  async expectNewTableModal() {
    await this.page.waitForSelector(this.newTableDialogTitle);
  }

  async openRecommendations() {
    await this.page.click(this.recommendationsButton);
  }

  async selectTableByName(tableName: string) {
    await this.page.click(this.getTableNameFromRecommendations(tableName));
  }

  async selectFirstSuggestedIcon() {
    await this.page.locator(this.firstSuggestedIcon).click();
  }

  async setTableDescription(description: string) {
    await this.page.fill(this.tableDescriptionInput, description);
  }

  async createTable() {
    await this.page.locator(this.createTableButton).click();
  }

  async searchTable(tableName: string) {
  const searchBox = this.page.locator(this.searchBox);
  await searchBox.fill(tableName);
  await searchBox.press('Enter');
  await this.page.waitForTimeout(2000); // this wait is added for user to see that the search logic worked
  }

  async clickDeleteIcon(tableName: string) {
    await this.page.click(this.getDeleteIconLocator(tableName));
  }

  async expectDeletePopup() {
  await this.page.waitForSelector(this.deletePopupTitle);
  }

  async isTablePresent(tableName: string): Promise<boolean> {
    await this.searchTable(tableName);
    const tableRows = await this.page.locator('//tr[@role="row"]/td/a').allTextContents();
    return tableRows.includes(tableName);
  }

  async validateOnlyTableDisplayed(tableName: string) {
    const tableRows = await this.page.locator('//tr[@role="row"]/td/a').allTextContents();
    return tableRows.length === 1 && tableRows[0] === tableName;
  }

  async confirmDeleteTable() {
    await this.page.fill(this.typeYesField, 'YES');
    await this.page.click(this.deleteTableButton);
  }

  async isTableAbsent(tableName: string): Promise<boolean> {
    await this.searchTable(tableName);
    const tableRows = await this.page.locator('//tr[@role="row"]/td/a').allTextContents();
    return !tableRows.includes(tableName);
  }

  async moveTableByName(tableName: string) {
    await this.page.click(this.getMoveTableIcon(tableName));
  }
}
