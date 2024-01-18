# ExampleControl

This sample shows how to create a control with a simple attribute.

The project has a project [ExampleControl](ExampleControl) with the implementation of the `ColorChange` control and a usage of this in [ExampleHmi](ExampleHmi).

* The control has an attribute named `value` which has a boolean datatype.
* The attribute is defined in the [Description.json](ExampleControl/ColorChange/Description.json) at the property `attributes`.
* The corresponding Setter (`setValue`) and Getter (`getValue`) are hosted in the file [ExampleControl/ColorChange/ColorChange.ts](ExampleControl/ColorChange/ColorChange.ts).
* The Setter calls on change the `__processValue` function which toggles a [HTML class](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) on a graphical HTMLDivElement `__elementCircle`.
* This class is referenced in a [CSS file](https://developer.mozilla.org/en-US/docs/Web/CSS) which then changes the color.

See Beckhoff Information System for more information about controls:
https://infosys.beckhoff.com/content/1033/te2000_tc3_hmi_engineering/8971583499.html?id=6326028457938979673

# Controls unit tests

The Visual Studio solution contains [another project](ControlTest) with an example for creating unit tests with controls.
