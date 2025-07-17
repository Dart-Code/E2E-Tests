import { _electron as electron, ElectronApplication, Page } from "playwright";
import { VSCodePage } from "../pages/vs_code";
import { PropertyEditorPage } from "../pages/property_editor";
import { test as base } from "@playwright/test";
import { TEST_CONFIG } from "../config/test-config";

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
				".",
				"lib\\main.dart",
			],
			cwd: TEST_CONFIG.TEST_PROJECT,
			executablePath: TEST_CONFIG.CODE_EXECUTABLE,
		});
		const page = await electronApp.firstWindow();
		await use({ electronApp, page });
		await electronApp.close();
	},

	vsCodePage: async ({ vsCodeApp }, use) => {
		await use(new VSCodePage(vsCodeApp.page));
	},

	propertyEditor: async ({ vsCodeApp }, use) => {
		await use(new PropertyEditorPage(vsCodeApp.page));
	}
});
