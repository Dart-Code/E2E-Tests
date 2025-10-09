import { Page, TestInfo } from "@playwright/test";
import { EmbeddedFrameFinder } from "../utils/embedded-frame-finder";
import { PropertyEditorPage } from "./property-editor-page";
import { TEST_CONFIG } from "../config";
import { WidgetPreviewPage } from "./widget-preview-page";

/**
 * Handles VS Code interactions.
 */
export class VSCodePage {
	constructor(private readonly page: Page, private readonly testInfo: TestInfo) { }

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

	findEmbeddedFrame(title: string) {
		return EmbeddedFrameFinder.findInSidebar(this.page, title);
	}

	async showPropertyEditor() {
		await this.clickSidebarButton("Flutter Property Editor");
		const frame = await this.findEmbeddedFrame("Flutter Property Editor");
		return new PropertyEditorPage(frame);
	}

	async showWidgetPreview() {
		await this.clickSidebarButton("Flutter Widget Preview");
		const frame = await this.findEmbeddedFrame("Flutter Widget Preview");
		return new WidgetPreviewPage(frame);
	}

	async closeAllFiles() {
		const tabs = this.page.locator(".tabs-and-actions-container .tab");
		while (await tabs.count() > 0) {
			await this.runCommand("view: revert and close editor");
			await this.page.waitForTimeout(100);
		}
	}

	async saveAllFiles() {
		await this.runCommand("file: save all files");
		await this.page.waitForTimeout(100);
	}

	async openCommandPalette() {
		await this.page.locator(".command-center").click();
		const input = this.page.getByPlaceholder("Search files by name");
		// TODO(dantup): Without this wait, on CI we seem to sometimes
		//  try typing in the input before it's visible, even though
		//  fill() is supposed to wait for actionability 🤷‍♂️.
		await input.waitFor({ state: "visible" });
		return input;
	}

	async commitInCommandPalette(text: string) {
		await this.debugScreenshot('before command palette');
		const commandPalette = await this.openCommandPalette();
		await this.debugScreenshot('with command palette open');
		await commandPalette.fill(text);
		await this.debugScreenshot('after typing');
		await this.page.waitForTimeout(10);
		await this.debugScreenshot('before <enter>');
		await this.page.keyboard.press("Enter");
		await this.debugScreenshot('after <enter>');
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
		return this.page.locator(".monaco-editor[data-uri^=\"file://\"]");
	}

	private screenshotNumber = 1;

	/**
	 * Takes a screenshot if config is set to debug to help track down flakes.
	 *
	 * Calls to this method are temporary and should be removed once the flakes are fixed.
	 */
	async debugScreenshot(name: string) {
		if (TEST_CONFIG.DEBUG) {
			await this.screenshot(name);
		}
	}

	/**
	 * Takes a screenshot and attaches it to the test report.
	 *
	 * @param name - Name for the screenshot
	 */
	async screenshot(name: string) {
		return this.testInfo.attach(`${this.screenshotNumber++}: ${name}`, {
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
