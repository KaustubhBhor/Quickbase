# Quickbase Kaustubh Playwright Automation

## Prerequisites
- Node.js (v18 or above recommended)
- npm (comes with Node.js)
- Git

## Clone the Repository
```sh
git clone <your-github-repo-url>
cd Quickbase_Kaustubh
```

## Install Dependencies
```sh
npm install
```

## Environment Setup
1. **Install `Playwright Test for VSCode` extension by `Microsoft` and restart VSCode.**
    - This extention helps you execute single tests using a Play button displayed on test method lines.
    
2. Create a `.env` file in the project root:
   ```env
   USERNAME=your_quickbase_username
   PASSWORD=your_quickbase_password
   ```
3. (Optional) Update any other environment variables as needed.

## Playwright Setup
```sh
npx playwright install --with-deps
```
## Storage State setup `Important !!!`
**Run the Storage State test case first:**
1. - `Comment` out the following code in `tests/generateStorageState.spec.ts`:
     ```typescript
     if (!isRunningAlone) {
         test.skip();
     }
     ```
2. - Execute below command to run test that generates the storage state 
    Run:
     ```sh
     npx playwright test tests/generateStorageState.spec.ts
     ```
3. - The test will pause and allow you to log in manually in the browser.
4. - After successful login, resume the test from Playwright UI modal to save the storage state (logged-in session).
   - This step ensures all subsequent tests use the authenticated browser session.
5. - `Uncomment` the below code again in `tests/generateStorageState.spec.ts` to avoid this test from running again along with other tests:
     ```typescript
     if (!isRunningAlone) {
         test.skip();
     }
     ```

## Running Tests
### Standard Test Run
```sh
npm test
```

### Allure Report Generation
```sh
npm run test:allure
```
- This will run tests, generate Allure results, and open the Allure report in your browser.

### Clean Allure Results (Windows)
```sh
npm run clean:allure
```

## GitLab CI/CD
- The project includes a `.gitlab-ci.yaml` for running tests and generating Allure reports on AWS GitLab runners.

## Project Structure
- `pages/` - Page Object Model classes
- `facades/` - Composite action classes
- `tests/` - Test cases
- `data/` - Test data and expected texts
- `.env` - Environment variables (not committed)

## Notes
- All sensitive data (like credentials) should be stored in `.env` and never committed.
- For cross-platform cleaning, use `rimraf` (already in devDependencies).