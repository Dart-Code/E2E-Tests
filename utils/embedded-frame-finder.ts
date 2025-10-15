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

		const embeddedFrame = await new Promise<Frame>(async (resolve, reject) => {
			const foundFrameTitles = new Set<string>();
			timeoutTimeout = setTimeout(() => {
				if (searching) {
					searching = false;
					reject(`Failed to find iframe "${title}" within timeout. Found: ${[...foundFrameTitles].map((title) => `"${title}"`).join(", ")}`);
				}
			}, 120000);

			searchLoop:
			while (searching) {
				for (const frame of page.frames()) {
					try {
						const frameElement = await frame.frameElement();
						const frameTitle = await frameElement.getAttribute("title");
						if (frameTitle)
							foundFrameTitles.add(frameTitle);
						if (frameTitle == title) {
							// Ensure this is a loaded frame with a Flutter app in it. If we don't do this
							// we will sometimes find some kind of intermediate temporary frame and then
							// fail later with "Frame was detached".
							try {
								await frame.frameLocator("iframe").locator("flt-semantics-placeholder").waitFor({ state: 'attached', timeout: 100 });
							} catch (e) {
								// If this fails, then this frame is no good.
								continue;
							}

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

		return embeddedFrame.frameLocator("iframe");
	}
}
