import { Page, TestInfo } from "@playwright/test";

/**
 * Handles VS Code interactions.
 */
export class VSCodePage {
	constructor(private page: Page) { }

	/**
	 * Clicks a sidebar button by name.
	 *
	 * @param name - The name/text of the sidebar button
	 */
	async clickSidebarButton(name: string): Promise<void> {
		await this.getSidebarButton(name).click();
	}

	/**
	 * Gets a sidebar button locator by name.
	 *
	 * @param name - The name/text of the sidebar button
	 */
	getSidebarButton(name: string) {
		return this.page.getByRole("tab", { name }).locator("a");
	}

	/**
	 * Gets the code editor.
	 */
	getEditor() {
		return this.page.locator(".monaco-editor");
	}

	/**
	 * Takes a screenshot and attaches it to the test report.
	 *
	 * @param name - Name for the screenshot
	 * @param testInfo - Playwright test info object
	 */
	async screenshot(name: string, testInfo: TestInfo) {
		return testInfo.attach(name, {
			body: await this.page.screenshot(),
			contentType: 'image/png'
		});
	}

	/**
	 * Waits for a specified timeout.
	 *
	 * @param timeout - Timeout in milliseconds
	 * @deprecated TODO(dantup): Remove this, we shouldn't use delays like this.
	 */
	waitForTimeout(timeout: number) {
		return this.page.waitForTimeout(timeout);
	}
}
