import { FrameLocator, Locator, Page } from "@playwright/test";

/**
 * Handles interactions with the Flutter Property Editor.
 */
export class PropertyEditorPage {
	private devToolsFrame: FrameLocator;

	constructor(page: Page) {
		this.devToolsFrame = page.locator("iframe").first().contentFrame()
			.locator("iframe[title='Flutter Property Editor']").contentFrame()
			.locator("#devToolsFrame").contentFrame();
	}

	/**
	 * Enables accessibility in the Flutter app so we can locate things using the semantics tree.
	 */
	async enableAccessibility(): Promise<void> {
		const accessibilityButton = this.devToolsFrame.locator(
			"flt-semantics-placeholder[role='button'][aria-label='Enable accessibility']"
		);
		await accessibilityButton.waitFor({ state: 'attached' });
		return accessibilityButton.dispatchEvent("click");
	}

	/**
	 * Gets the input for an argument in the property editor by the property name.
	 *
	 * @param name - The name of the property input field
	 */
	getPropertyInput(name: string) {
		// TODO(dantup): Put better Semantics() around these inputs so this is more specific.
		// return devToolsFrame.locator(`[flt-semantics-identifier='property_${name}'] input`);
		return this.devToolsFrame.locator(`input[aria-label$=' ${name}']`);
	}

	/**
	 * Updates the value of an input and then moves focus so that the value is committed.
	 *
	 * @param input - The input
	 * @param text - The new text value
	 */
	async updatePropertyValue(input: Locator, text: string) {
		await input.selectText();
		await input.fill(text);
		await input.blur();
	}
}
