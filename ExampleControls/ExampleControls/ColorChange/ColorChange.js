// ColorChange is an ES module: it imports the framework API from the framework main export file.
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
// ColorChangeClassic is the same control with the global TcHmi namespace.
import { Controls, EventProvider, TcHmiControl, ValueConverter } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';
// The class is exported for inheritance and for the unit tests in UnitTests.
export class ColorChange extends TcHmiControl.Control {
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
     * @param element Element from HTML (internal, do not use)
     * @param pcElement precompiled Element (internal, do not use)
     * @param attrs Attributes defined in HTML in a special format (internal, do not use)
     */
    constructor(element, pcElement, attrs) {
        /** Call base class constructor */
        super(element, pcElement, attrs);
    }
    __elementTemplateRoot;
    /** circle element as native DOM element */
    __elementCircle;
    ///** svg polygon element as native DOM element */
    //protected __elementSvgPolygon!: SVGPolygonElement;
    /** Initial undefined, after init the value of the attribute */
    __value;
    /**
     * Raised after the control was added to the control cache and the constructors of all base classes were called.
     */
    __previnit() {
        // Fetch template root element as jQuery Element
        this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_ExampleControls_ColorChange-Template');
        if (this.__elementTemplateRoot.length === 0) {
            throw new Error('Invalid Template.html');
        }
        // Fetch template root element as native Element
        const circleElem = this.__element[0].querySelector('.TcHmi_Controls_ExampleControls_ColorChange-circle');
        if (!circleElem) {
            throw new Error('Invalid Template.html');
        }
        // remember native DOM element
        this.__elementCircle = circleElem;
        //const inlinePolygon = this.__element[0].querySelector<SVGPolygonElement>('.TcHmi_Controls_ExampleControls_ColorChange-svgpolygon');
        //if (!inlinePolygon) {
        //    throw new Error('Invalid Template.html');
        //}
        //this.__elementSvgPolygon = inlinePolygon;
        // Call __previnit of base class
        super.__previnit();
    }
    /**
     * Is called during control initialization after the attribute setters have been called.
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
     * Will be called automatically if system destroys control!
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
    /**
     * Setter function for 'data-tchmi-value' attribute.
     * @param valueNew the new value or null
     */
    setValue(valueNew) {
        // With false as default value, null (for example from a binding without a value) is converted to false
        const convertedValue = ValueConverter.toBoolean(valueNew, false);
        if (convertedValue === this.__value) {
            return;
        }
        // Save new value
        this.__value = convertedValue;
        // Inform the Framework that this property has changed (needed for binding updates)
        EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'Value' });
        // Trigger update of own visualisation
        this.__processValue();
    }
    /**
     * Getter function for 'data-tchmi-value' attribute.
     */
    getValue() {
        return this.__value;
    }
    /**
     * Processor function for 'data-tchmi-value' attribute.
     */
    __processValue() {
        // Direct set visual appearance. The colors of the classes are defined per theme in Themes/<theme>/Style.css.
        this.__elementCircle.classList.toggle('glow-green', this.__value);
        this.__elementCircle.classList.toggle('glow-red', !this.__value);
        // or set conditional
        //if (this.__value) {
        //    this.__elementSvgPolygon.setAttribute('points', '250,0 500,250 250,500 0,250');
        //} else {
        //    this.__elementSvgPolygon.setAttribute('points', '70,70 430,70 430,430 70,430');
        //}
    }
}
/*
 * Register Control
 */
Controls.registerEx('ColorChange', 'TcHmi.Controls.ExampleControls', ColorChange);
//# sourceMappingURL=ColorChange.js.map