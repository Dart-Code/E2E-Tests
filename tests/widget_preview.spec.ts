import { test } from "../fixtures";

test.describe("Widget Preview", () => {
	test("should update as file is modified", async ({ vsCodePage }, testInfo) => {
		const widgetPreview = await vsCodePage.showWidgetPreview();
		await widgetPreview.enableAccessibility();
		await widgetPreview.waitForLoad();

		// Allow some time for everything to settle...
		await vsCodePage.waitForTimeout(3000);

		await vsCodePage.openFile("lib/main.dart");

		// Force trigger an event that updates the location, and also a change to trigger a build.
		// Sometimes the tests run fast enough that we can open a file without the widget preview
		// watching yet and it never loads the previews for the current file.
		const editor = vsCodePage.getEditor();
		await editor.click();
		await editor.getByText("Flutter Demo Home Page").click();
		await editor.pressSequentially("!");
		await vsCodePage.saveAllFiles();

		// Allow some time for everything to settle...
		await vsCodePage.waitForTimeout(3000);

		// Ensure the standard label is visible in the embedded preview.
		await widgetPreview.ensureText("You have pushed the button this many times");

		// Modify the text and save.
		await editor.getByText("You have pushed the button").click();
		await editor.pressSequentially("insertedinsertedinserted");
		await vsCodePage.saveAllFiles();

		// Ensure the updated label is visible in the embedded preview.
		await widgetPreview.ensureText("insertedinsertedinserted");

		// Attach a screenshot to the report
		await vsCodePage.screenshot('final-screenshot');
	});
});
