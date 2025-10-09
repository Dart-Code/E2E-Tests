import { FrameLocator } from "@playwright/test";

/**
 * A base for classes that represent embedded iframe-based views such as the Property Editor
 * and Widget Preview.
 */
export abstract class EmbeddedFramePage {
	constructor(protected readonly frame: FrameLocator) { }

	/**
	 * Enables accessibility in the Flutter app so we can locate things using the semantics tree.
	 */
	async enableAccessibility(): Promise<void> {
		const accessibilityButton = this.frame.locator(
			"flt-semantics-placeholder[role='button'][aria-label='Enable accessibility']"
		);
		await accessibilityButton.waitFor({ state: 'attached' });
		return accessibilityButton.dispatchEvent("click");
	}
}
