// MockupHelper also loads TcHmi.* API
import { cleanupSystem, createControl, prepareSystemForControlType } from "../helpers/mockupHelper.js";
import { ColorChange } from "ExampleControl/ColorChange/ColorChange.js";
const controlType = "TcHmi.Controls.ExampleControl.ColorChange";

describe("ColorChange", () => {
    beforeEach(() => {
        prepareSystemForControlType(controlType, ColorChange);
    });
    afterEach(() => {
        // cleanup all mockup'ed (internal?) controls after each run
        cleanupSystem();
    });
    describe("Attributes", () => {
        let rawControl: ColorChange;
        beforeEach(async () => {
            rawControl = await createControl(
                controlType,
                ColorChange
            );
        });
        describe("Value", () => {
            it("Setting true manipulates classes", () => {
                rawControl.setValue(true);

                // Access protected property. This is fine for typescript
                const circleElement = rawControl["__elementCircle"];

                expect(circleElement.classList.contains("glow-green"))
                    .withContext("glow-green class")
                    .toBe(true);
                expect(circleElement.classList.contains("glow-red"))
                    .withContext("glow-red class")
                    .toBe(false);
            });
        });
    });
});
