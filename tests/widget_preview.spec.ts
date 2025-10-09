import { expect } from "@playwright/test";
import { test } from "../fixtures";

test.describe("Widget Preview", () => {
	test("should update as file is modified", async ({ vsCodePage }, testInfo) => {
		const widgetPreview = await vsCodePage.showWidgetPreview();
		await widgetPreview.enableAccessibility();
		await widgetPreview.waitForLoad();

		await vsCodePage.openFile("lib/main.dart");

		// Ensure the standard label is visible in the embedded preview.
		await widgetPreview.ensureText("You have pushed the button this many times");

		// Modify the text and save.
		const editor = vsCodePage.getEditor();
		await editor.click();
		await editor.getByText("You have pushed the button").click();
		await editor.pressSequentially("insertedinsertedinserted");
		await vsCodePage.saveAllFiles();

		// Ensure the updated label is visible in the embedded preview.
		await widgetPreview.ensureText("insertedinsertedinserted");

		// Attach a screenshot to the report
		await vsCodePage.screenshot('final-screenshot');
	});
});
