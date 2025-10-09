import { test as base } from "@playwright/test";
import { _electron as electron, ElectronApplication, Page } from "playwright";
import { TEST_CONFIG } from "../config";
import { VSCodePage } from "../pages";

export const test = base.extend<{
	vsCodeApp: { electronApp: ElectronApplication; page: Page };
	vsCodePage: VSCodePage;
}>({
	vsCodeApp: async ({ }, use) => {
		const args = [
			"--user-data-dir",
			TEST_CONFIG.VSCODE_USER_DATA_DIR,
			"--extensions-dir",
			TEST_CONFIG.VSCODE_EXTENSIONS_DIR,
			"--disable-workspace-trust",
			"--extensionDevelopmentPath",
			TEST_CONFIG.DART_CODE_EXTENSION_DIR,
			"--extensionDevelopmentPath",
			TEST_CONFIG.FLUTTER_CODE_EXTENSION_DIR,
			TEST_CONFIG.TEST_PROJECT_DIR,
		];
		// console.log(`Launching VS Code as Electron app with args: ${args.join(" ")}`);
		const electronApp = await electron.launch({
			args,
			cwd: TEST_CONFIG.TEST_PROJECT_DIR,
			executablePath: TEST_CONFIG.VSCODE_ELECTRON_EXECUTABLE,

			// We must set a locale explicitly, because otherwise Playwright will infer it from the LANG
			// env variable which is "C.UTF-8" and results in ["en-US", "c"] which triggers an unhandled
			// exception in Flutter/DevTools when trying to parse the languages.
			//
			// https://github.com/Dart-Code/E2E-Tests/issues/4#issuecomment-3274908610
			locale: "en-US",
		});
		const page = await electronApp.firstWindow();
		// Set default timeout because config doesn't seem to work
		// https://github.com/microsoft/playwright/issues/37783
		page.setDefaultTimeout(180 * 1000); // 180 sec
		await use({ electronApp, page });
		await electronApp.close();
	},

	vsCodePage: async ({ vsCodeApp }, use, testInfo) => {
		const vsCodePage = new VSCodePage(vsCodeApp.page, testInfo);
		// Wait for some sidebar icons to become visible.
		await vsCodeApp.page.locator(".activitybar .actions-container .action-item").first().waitFor({ state: "visible", timeout: 5000 });
		// And some extra for hot file restore.
		await vsCodeApp.page.waitForTimeout(500);

		await vsCodePage.closeAllFiles();
		await use(vsCodePage);
	},
});
