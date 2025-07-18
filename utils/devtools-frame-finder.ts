import { spawn } from "child_process";
import path from "path";
import { TEST_CONFIG } from "../config";
import { Frame, FrameLocator, Page } from "@playwright/test";

/**
 * Utility class for finding DevTools iframes.
 */
export class DevToolsFrameFinder {
	/**
	 * Finds a given DevTools iframe in the sidebar.
	 */
	static async findInSidebar(page: Page, title: string): Promise<FrameLocator> {
		var searching = true;
		var timeoutTimeout: NodeJS.Timeout;

		const propertyEditorFrame = await new Promise<Frame>(async (resolve, reject) => {
			timeoutTimeout = setTimeout(() => {
				if (searching) {
					searching = false;
					reject(`Failed to find Flutter Property Editor frame within timeout`);
				}
			}, 30000);

			searchLoop:
			while (searching) {
				for (const frame of page.frames()) {
					try {
						const frameElement = await frame.frameElement();
						const frameTitle = await frameElement.getAttribute("title");
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

		return propertyEditorFrame.frameLocator("iframe#devToolsFrame");
	}
}
