const controlType = "TcHmi.Controls.ExampleControl.ColorChange";
describe("ColorChange", () => {
    beforeEach(() => {
        TcHmiTest.ControlHelper.prepareSystemForControlType(controlType, TcHmi.Controls.ExampleControl.ColorChange);
    });
    afterEach(() => {
        // cleanup all mockup'ed (internal?) controls after each run
        TcHmiTest.ControlHelper.cleanupSystem();
    });
    describe("Attributes", () => {
        let rawControl: TcHmi.Controls.ExampleControl.ColorChange;
        beforeEach(async () => {
            rawControl = await TcHmiTest.ControlHelper.createControl(
                controlType,
                TcHmi.Controls.ExampleControl.ColorChange
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
