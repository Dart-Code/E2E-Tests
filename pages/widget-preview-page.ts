import { FrameLocator } from "@playwright/test";
import { EmbeddedFramePage } from "./embedded_frame_page";

/**
 * Handles interactions with the Flutter Widget Preview.
 */
export class WidgetPreviewPage extends EmbeddedFramePage {
	constructor(frame: FrameLocator) {
		super(frame);
	}

	/**
	 * Waits for the Widget Preview to show the welcome text.
	 */
	async waitForLoad() {
		await this.frame
			.getByText("No previews detected")
			.waitFor({ state: 'visible' });
	}

	/**
	 * Ensures the given text appears on the page.
	 *
	 * @param text - The text to find.
	 */
	async ensureText(text: string) {
		const element = this.frame.getByText(text);
		await element.waitFor({ state: 'attached' });
		return element;
	}
}
