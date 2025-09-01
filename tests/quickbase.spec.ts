import { test, expect } from '@playwright/test';
import { AppSettingsPage } from '../pages/AppSettingsPage';
import { LoginPage } from '../pages/LoginPage';
import { TablesPage } from '../pages/TablesPage';
import { TableFacade } from '../facades/TableFacade';
import expectedTexts from '../data/expectedTexts.json';

const storageStatePath = 'storageState.json';

test.use({ storageState: storageStatePath });

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

test('Navigate to Tables page', async ({ page }) => {
  // No need to login again, storage state is used
  const appSettingsPage = new AppSettingsPage(page);
  await appSettingsPage.navigateToTables();
  await expect(page).toHaveURL(/.*AppTablesList*./);
});

test('Create new table', async ({ page }) => {
  const appSettingsPage = new AppSettingsPage(page);
  await appSettingsPage.navigateToTables();

  const tableName = 'Employees';
  const description = 'Table of Employees';
  const tableFasade = new TableFacade(page);
  const created = await tableFasade.createTableIfNotExists(tableName, description);
  if (!created) {
    test.skip(true, `'${tableName}' table already exists, skipping creation.`);
  }
});

test('Delete Employees table using search and verify popup', async ({ page }) => {
  const appSettingsPage = new AppSettingsPage(page);
  await appSettingsPage.navigateToTables();

  const tablesPage = new TablesPage(page);
  const tableFasade = new TableFacade(page);
  const tableName = 'Employees';

  // Check if Employees table exists
  const exists = await tablesPage.isTablePresent(tableName);
  if (!exists) {
    test.skip(true, `'${tableName}' table does not exist, skipping deletion.`);
    return;
  }

  // Validation: Only Employees table is displayed
  expect(await tablesPage.validateOnlyTableDisplayed(tableName)).toBe(true);

  await tableFasade.deleteTable(tableName);

  // Verify Employees table is no longer displayed
  expect(await tablesPage.isTableAbsent(tableName)).toBe(true);
});

test('Move this table content validation', async ({ page }) => {
  const appSettingsPage = new AppSettingsPage(page);
  await appSettingsPage.navigateToTables();

  const tablesPage = new TablesPage(page);
  const tableName = 'Assignments';

  // Click the move icon for Assignments table
  await tablesPage.moveTableByName(tableName);

  // Read content from modal with id="move-table-dialog"
  const modalText = await page.locator('#move-table-dialog').innerText();
  const tableNameToMove = await page.locator('#tableNameToMove').innerText();

  // Verify expected lines are present
  expect(tableNameToMove).toContain(tableName);
  expect(modalText).toContain(expectedTexts.moveTablePopupLine1);
  expect(modalText).toContain(expectedTexts.moveTablePopupLine2);
  expect(modalText).toContain(expectedTexts.moveTablePopupLine3);
  await page.waitForTimeout(2000);
});
