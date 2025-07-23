import { expect } from "@playwright/test";
import { test } from "../fixtures";
import { ExtensionInstaller } from "../utils";
import { PropertyEditorPage } from "../pages";

test.describe("Property Editor", () => {
  test("should be able to modify arguments", async ({ vsCodePage }, testInfo) => {
    const propertyEditor = await vsCodePage.showPropertyEditor();
    await propertyEditor.enableAccessibility();
    await propertyEditor.waitForLoad();

    // TODO(dantup): Opening the property editor may steal focus and close the command palette. Fix this!
    await vsCodePage.waitForTimeout(3000);

    await vsCodePage.openFile("lib/main.dart");

    // Put the text cursor in MaterialApp in the source
    const editor = vsCodePage.getEditor();
    await editor.click();
    await editor.getByText("MaterialApp").click();

    // Find the input for the title property
    const titleInput = await propertyEditor.getPropertyInput("title");

    // Update the text multiple times so we don't rely on the original value not matching
    // the new value
    for (let i = 0; i < 5; i++) {
      const newTitle = `New Flutter Demo ${i}`;
      await propertyEditor.updatePropertyValue(titleInput, newTitle);
      await expect(editor).toContainText(`title: '${newTitle}',`);

      // TODO(dantup): We need a hook for knowing when the editor has updated again.
      //  Could/should we disable the fields while the edit request is in-flight?
      await vsCodePage.waitForTimeout(1000);
    }

    // Attach a screenshot to the report
    await vsCodePage.screenshot('final-screenshot', testInfo);
  });
});
