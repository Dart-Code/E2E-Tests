import { Frame, FrameLocator, Page } from "@playwright/test";

/**
 * Utility class for finding embedded iframes.
 */
export class EmbeddedFrameFinder {
	/**
	 * Finds a given iframe in the sidebar.
	 */
	static async findInSidebar(page: Page, title: string): Promise<FrameLocator> {
		var searching = true;
		var timeoutTimeout: NodeJS.Timeout;

		const propertyEditorFrame = await new Promise<Frame>(async (resolve, reject) => {
			const foundFrameTitles = new Set<string>();
			timeoutTimeout = setTimeout(() => {
				if (searching) {
					searching = false;
					reject(`Failed to find iframe "${title}" within timeout. Found: ${[...foundFrameTitles].map((title) => `"${title}"`).join(", ")}`);
				}
			}, 30000);

			searchLoop:
			while (searching) {
				for (const frame of page.frames()) {
					try {
						const frameElement = await frame.frameElement();
						const frameTitle = await frameElement.getAttribute("title");
						if (frameTitle)
							foundFrameTitles.add(frameTitle);
						if (frameTitle == title) {
							searching = false;
							clearTimeout(timeoutTimeout);
							resolve(frame);
							break searchLoop;
						}
					} catch {
						// Ignore errors, frames might disappear.
					}
				}

				// Keep retrying
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		});

		return propertyEditorFrame.frameLocator("iframe");
	}
}
