/*
 * Generated 9/1/2023 12:57:14 AM
 * Copyright (C) 2023
 */
module TcHmi {
    export module Controls {
        export module ExampleControl {
            export class ColorChange extends TcHmi.Controls.System.TcHmiControl {

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
                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: JQuery;
                /** circle element as native DOM element */
                protected __elementCircle!: HTMLDivElement;

                ///** svg polygon element as native DOM element */
                //protected __elementSvgPolygon!: SVGPolygonElement;

                /** Initial undefined, after init the value of the attribute */
                protected __value: boolean | undefined;

                /**
                 * Raised after the control was added to the control cache and the constructors of all base classes were called.
                 */
                public __previnit() {
                    // Fetch template root element as jQuery Element
                    this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_ExampleControl_ColorChange-Template');
                    if (this.__elementTemplateRoot.length === 0) {
                        throw new Error('Invalid Template.html');
                    }

                    // Fetch template root element as native Element
                    const jqCircle = this.__element[0].querySelector<HTMLDivElement>('.TcHmi_Controls_ExampleControl_ColorChange-circle');
                    if (!jqCircle) {
                        throw new Error('Invalid Template.html');
                    }
                    // remember native DOM element
                    this.__elementCircle = jqCircle;

                    //const inlinePolygon = this.__element[0].querySelector<SVGPolygonElement>('.TcHmi_Controls_ExampleControl_ColorChange-svgpolygon');
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
                public __init() {
                    super.__init();
                }

                /**
                 * Is called by the system after the control instance is inserted into the active DOM.
                 */
                public __attach() {
                    super.__attach();

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */
                }

                /**
                 * Is called by the system when the control instance is no longer part of the active DOM.
                 */
                public __detach() {
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
                public destroy() {
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
                public setValue(valueNew) {
                    // Without second parameter the result can be null which must be handled in the process function
                    var convertedValue = TcHmi.ValueConverter.toBoolean(valueNew, false);
                    if (convertedValue === this.__value) {
                        return;
                    }

                    // Save new value
                    this.__value = convertedValue;
                    // Inform the Framework that this property has changed (needed for binding updates)
                    TcHmi.EventProvider.raise(this.__id + ".onPropertyChanged", { propertyName: "Value" });
                    // Trigger update of own visualisation
                    this.__processValue();
                };
                /**
                * Getter function for 'data-tchmi-value' attribute.
                */
                public getValue() {
                    return this.__value;
                };
                /**
                * Processor function for 'data-tchmi-value' attribute.
                */
                public __processValue() {
                    // Direct set visual appearance 
                    this.__elementCircle.classList.toggle('glow-green', this.__value);
                    this.__elementCircle.classList.toggle('glow-red', !this.__value);
                    // or set conditional
                    //if (this.__value) {
                    //    this.__elementSvgPolygon.setAttribute('points', '250,0 500,250 250,500 0,250');
                    //} else {
                    //    this.__elementSvgPolygon.setAttribute('points', '70,70 430,70 430,430 70,430');
                    //}
                };
            }
        }
    }
}

/**
 * Register Control
 */
TcHmi.Controls.registerEx('ColorChange', 'TcHmi.Controls.ExampleControl', TcHmi.Controls.ExampleControl.ColorChange);
