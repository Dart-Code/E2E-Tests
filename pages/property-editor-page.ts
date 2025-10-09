import { FrameLocator, Locator } from "@playwright/test";
import { EmbeddedFramePage } from "./embedded_frame_page";

/**
 * Handles interactions with the Flutter Property Editor.
 */
export class PropertyEditorPage extends EmbeddedFramePage {
	constructor(frame: FrameLocator) {
		super(frame);
	}

	/**
	 * Waits for the Property Editor to show the welcome text.
	 */
	async waitForLoad() {
		await this.frame
			.getByText("Welcome to the Flutter Property Editor")
			.waitFor({ state: 'visible' });
	}

	/**
	 * Gets the input for an argument in the property editor by the property name.
	 *
	 * @param name - The name of the property input field
	 */
	async getPropertyInput(name: string) {
		// TODO(dantup): Put better Semantics() around these inputs so this is more specific.
		// return devToolsFrame.locator(`[flt-semantics-identifier='property_${name}'] input`);
		const input = this.frame.locator(`input[aria-label$=' ${name}']`);
		await input.waitFor({ state: 'attached' });
		return input;
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
