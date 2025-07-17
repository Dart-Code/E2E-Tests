import { Page, TestInfo } from "@playwright/test";

export class VSCodePage {
	constructor(private page: Page) { }

	clickSidebarButton(name: string) {
		return this.getSidebarButton(name).click();
	}

	getSidebarButton(name: string) {
		return this.page.getByRole("tab", { name }).locator("a");
	}

	getEditor() {
		return this.page.locator(".monaco-editor");
	}

	async screenshot(name: string, testInfo: TestInfo) {
		return testInfo.attach(name, {
			body: await this.page.screenshot(),
			contentType: 'image/png'
		});
	}

	// TODO(dantup): Remove this, we shouldn't use delays like this.
	waitForTimeout(timeout: number) {
		return this.page.waitForTimeout(timeout);
	}
}
