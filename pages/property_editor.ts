import { FrameLocator, Locator, Page } from "@playwright/test";

export class PropertyEditorPage {
	private devToolsFrame: FrameLocator;

	constructor(page: Page) {
		this.devToolsFrame = page.locator("iframe").first().contentFrame()
			.locator("iframe[title='Flutter Property Editor']").contentFrame()
			.locator("#devToolsFrame").contentFrame();
	}

	async enableAccessibility(): Promise<void> {
		const accessibilityButton = this.devToolsFrame.locator(
			"flt-semantics-placeholder[role='button'][aria-label='Enable accessibility']"
		);
		await accessibilityButton.waitFor({ state: 'attached' });
		return accessibilityButton.dispatchEvent("click");
	}

	getPropertyInput(name: string) {
		// TODO(dantup): Put better Semantics() around these inputs so this is more specific.
		// return devToolsFrame.locator(`[flt-semantics-identifier='property_${name}'] input`);
		return this.devToolsFrame.locator(`input[aria-label$=' ${name}']`);
	}

	async updatePropertyValue(input: Locator, text: string) {
		await input.selectText();
		await input.fill(text);
		await input.blur();
	}
}
