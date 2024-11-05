// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="../.hmiframework/TcHmi.d.ts" />

/*
 * Generated 5/27/2024 4:21:23 PM
 * Copyright (C) 2024
 */


// We can import a variable from another js module with this syntax
// because we are loaded as a module ourself (see Description.json#dependencyFiles).

// Here we import a full relative path so the browser knows where to look.
// Visual Studio Intellisense will search for "./someNumbers.ts", "./someNumbers.d.ts", "./someNumbers.js"
import { randomNumber, badNamedNumber as betterName } from "./someNumbers.js";
// We can also import the default value when we are sure we get the right one.
import defaultNumber from "./someNumbers.js";


// We also can import with a bare module name as a module specifier.
// To support this we have to tell the browser where the files are:
// We have a esmoduleImports property in the Manifest.json of this package.
// See
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap
// for background information.
import { TcHmiShortName } from "textmodule";

class JsControlWithImport extends TcHmi.Controls.System.TcHmiControl {

    /*
    Attribute philosophy
    --------------------
    - Local variables are not set in the class definition, so they have the value 'undefined'.
    - During compilation, the Framework sets the value that is specified in the HTML or in the theme (possibly 'null') via normal setters.
    - Because of the "changed detection" in the setter, the value is only processed once during compilation.
    - Attention: If we have a Server Binding on an Attribute, the setter will be called once with null to initialize and later with the correct value.
    */

    /**
     * Constructor of the control
     * @param {JQuery} element Element from HTML (internal, do not use)
     * @param {JQuery} pcElement precompiled Element (internal, do not use)
     * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
     * @returns {void}
     */
    constructor(element, pcElement, attrs) {
        /** Call base class constructor */
        super(element, pcElement, attrs);
    }
    /**
     * Raised after the control was added to the control cache and the constructors of all base classes were called.
     */
    __previnit() {
        // Fetch template root element
        this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_ExampleControlEsModule_JsControlWithImport-Template');
        if (this.__elementTemplateRoot.length === 0) {
            throw new Error('Invalid Template.html');
        }
        // Use import'ed value
        this.__elementTemplateRoot[0].textContent = 'Values from js import: \n' +
            'named import: ' + randomNumber + '\n' +
            'renamed import: ' + betterName + '\n' +
            'default import: ' + defaultNumber + '\n' +
            'import from mapped path: ' + TcHmiShortName;

        this.__elementTemplateRoot[0].style.whiteSpace = 'pre-line';

        // Call __previnit of base class
        super.__previnit();
    }
    /**
     * Is called during control initialization after the attribute setters have been called. 
     * @returns {void}
     */
    __init() {
        super.__init();
    }
    /**
     * Is called by the system after the control instance is inserted into the active DOM.
     */
    __attach() {
        super.__attach();
        /**
         * Initialize everything which is only available while the control is part of the active dom.
         */
    }
    /**
     * Is called by the system when the control instance is no longer part of the active DOM.
     */
    __detach() {
        super.__detach();

        /**
         * Disable everything that is not needed while the control is not part of the active DOM.
         * For example, there is usually no need to listen for events!
         */
    }
    /**
     * Destroy the current control instance.
     * Will be called automatically if the framework destroys the control instance!
     */
    destroy() {
        /**
         * Ignore while __keepAlive is set to true.
         */
        if (this.__keepAlive) {
            return;
        }
        super.destroy();
        /**
         * Free resources like child controls etc.
         */
    }
}
/*
 * Register Control class object for control
 */
TcHmi.Controls.registerEx('JsControlWithImport', 'TcHmi.Controls.ExampleControlEsModule', JsControlWithImport);
