# Control with Typescript / Javascript Modules

This sample shows how to create a control with [Javascript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
The main javascript files has to be marked in the dependencyFiles property of Description.json with the type `EsModule`.
Imported files should not be included in this property.

The Control [ControlWithImport](ControlWithImport) has a main typescript file [ControlWithImport.ts](ControlWithImport\ControlWithImport.ts)
with various different imports. This includes explaining typescript and the browser where the files are.

The Control [JsControlWithImport](JsControlWithImport) has a main javascript file [JsControlWithImport.ts](JsControlWithImport\JsControlWithImport.js)
with various different imports. This includes explaining the browser where the files are.
