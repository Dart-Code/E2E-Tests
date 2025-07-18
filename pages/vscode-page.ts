import { Page, TestInfo } from "@playwright/test";
import { DevToolsFrameFinder } from "../utils/devtools-frame-finder";
import { PropertyEditorPage } from "./property-editor-page";

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

	findDevToolsIframe(title: string) {
		return DevToolsFrameFinder.findInSidebar(this.page, title);
	}

	async showPropertyEditor() {
		await this.clickSidebarButton("Flutter Property Editor");
		const frame = await this.findDevToolsIframe("Flutter Property Editor");
		return new PropertyEditorPage(frame);
	}

	async closeAllFiles() {
		const tabs = this.page.locator(".tabs-and-actions-container .tab");
		while (await tabs.count() > 0) {
			await this.runCommand("view: revert and close editor");
			await this.page.waitForTimeout(1000);
		}
	}

	async openCommandPalette() {
		await this.page.locator(".command-center").click();
		await this.page.waitForTimeout(10);
		return this.page.getByPlaceholder("Search files by name");
	}

	async commitInCommandPalette(text: string) {
		const commandPalette = await this.openCommandPalette();
		await commandPalette.fill(text);
		await this.page.waitForTimeout(10);
		await this.page.keyboard.press("Enter");
	}

	/**
	 * Opens a file in the editor.
	 *
	 * @param fileSearchPath
	 */
	async openFile(fileSearchPath: string) {
		await this.commitInCommandPalette(fileSearchPath);
	}

	/**
	 * Runs a command via the Command Palette.
	 *
	 * @param fileSearchPath
	 */
	async runCommand(commandSearchText: string) {
		await this.commitInCommandPalette(`>${commandSearchText}`);
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
