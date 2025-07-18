import { _electron as electron, ElectronApplication, Page } from "playwright";
import { VSCodePage, PropertyEditorPage } from "../pages";
import { test as base, Frame } from "@playwright/test";
import { TEST_CONFIG } from "../config";

export const test = base.extend<{
	vsCodeApp: { electronApp: ElectronApplication; page: Page };
	vsCodePage: VSCodePage;
}>({
	vsCodeApp: async ({ }, use) => {
		const electronApp = await electron.launch({
			args: [
				"--user-data-dir",
				TEST_CONFIG.VSCODE_USER_DATA_DIR,
				"--extensions-dir",
				TEST_CONFIG.VSCODE_EXTENSIONS_DIR,
				"--disable-workspace-trust",
				TEST_CONFIG.TEST_PROJECT,
			],
			cwd: TEST_CONFIG.TEST_PROJECT,
			executablePath: TEST_CONFIG.VSCODE_ELECTRON_EXECUTABLE,
		});
		const page = await electronApp.firstWindow();
		await use({ electronApp, page });
		await electronApp.close();
	},

	vsCodePage: async ({ vsCodeApp }, use) => {
		const vsCodePage = new VSCodePage(vsCodeApp.page);
		// Wait for some sidebar icons to become visible.
		await vsCodeApp.page.locator(".activitybar .actions-container .action-item").first().waitFor({ state: "visible", timeout: 5000 });
		// And some extra for hot file restore.
		await vsCodeApp.page.waitForTimeout(500);

		await vsCodePage.closeAllFiles();
		await use(vsCodePage);
	},
});
