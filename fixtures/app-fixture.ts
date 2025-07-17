import { _electron as electron, ElectronApplication, Page } from "playwright";
import { VSCodePage, PropertyEditorPage } from "../pages";
import { test as base } from "@playwright/test";
import { TEST_CONFIG } from "../config";

export const test = base.extend<{
	vsCodeApp: { electronApp: ElectronApplication; page: Page };
	vsCodePage: VSCodePage;
	propertyEditor: PropertyEditorPage;
}>({
	vsCodeApp: async ({ }, use) => {
		const electronApp = await electron.launch({
			args: [
				"--user-data-dir",
				TEST_CONFIG.USER_DATA_DIR,
				"--disable-workspace-trust",
				TEST_CONFIG.TEST_PROJECT,
			],
			cwd: TEST_CONFIG.TEST_PROJECT,
			executablePath: TEST_CONFIG.CODE_EXECUTABLE,
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

	propertyEditor: async ({ vsCodeApp }, use) => {
		await use(new PropertyEditorPage(vsCodeApp.page));
	}
});
