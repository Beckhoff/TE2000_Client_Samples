/*
 * Generated 4/23/2025 3:51:07 PM
 * Copyright (C) 2025
 */
namespace TcHmi.Controls {
    export namespace MyPackage {
        export class MyControl extends TcHmi.Controls.System.TcHmiControl {

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

            protected __spinBox1: TcHmi.Controls.Beckhoff.TcHmiSpinboxInput | undefined;
            protected __spinBox2: TcHmi.Controls.Beckhoff.TcHmiSpinboxInput | undefined;
            protected __spinBox3: TcHmi.Controls.Beckhoff.TcHmiSpinboxInput | undefined;

            protected __myAttributeValue: MyControl.MyObjectType | null | undefined;

            /**
             * Raised after the control was added to the control cache and the constructors of all base classes were called.
             * This function is only to be used by the System. Other function calls are not intended.
             */
            public __previnit() {
                // Fetch template root element
                this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_MyPackage_MyControl-Template');
                if (this.__elementTemplateRoot.length === 0) {
                    throw new Error('Invalid Template.html');
                }

                // Initialize reference variables for Spinbox controls from Template.html.
                this.__spinBox1 = TcHmi.Controls.get<TcHmi.Controls.Beckhoff.TcHmiSpinboxInput>(`${this.getId()}.SpinboxInput_1`);
                this.__spinBox2 = TcHmi.Controls.get<TcHmi.Controls.Beckhoff.TcHmiSpinboxInput>(`${this.getId()}.SpinboxInput_2`);
                this.__spinBox3 = TcHmi.Controls.get<TcHmi.Controls.Beckhoff.TcHmiSpinboxInput>(`${this.getId()}.SpinboxInput_3`);


                // Call __previnit of base class
                super.__previnit();
            }
            /**
             * Is called during control initialization after the attribute setters have been called. 
             * This function is only to be used by the System. Other function calls are not intended.
             */
            public __init() {
                super.__init();
            }

            /**
             * Is called by the system after the control instance is inserted into the active DOM.
             * This function is only to be used by the System. Other function calls are not intended.
             */
            public __attach() {
                super.__attach();

                /**
                 * Initialize everything which is only available while the control is part of the active dom.
                 */

                // Register Spinbox onValueChanged events.
                // Spinbox 1
                const destroy1 = TcHmi.EventProvider.register(`${this.getId()}.SpinboxInput_1.onValueChanged`, (data) => {
                    if (!this.__myAttributeValue) {
                        return;
                    }
                    // Read current value from Spinbox and forward it to the current value of MyAttribute.
                    const value = this.__spinBox1?.getValue();
                    if (value !== undefined && value !== null) {
                        this.__myAttributeValue.number1 = value;
                    }
                    // Write updated MyAttribute value to the attributes ObjectResolver instance.
                    // ObjectResolver will compare the current value with its last known value and write back value changes of object paths with
                    // symbol expressions that have BindingMode=TwoWay back to the related symbol.
                    this.__objectResolvers.get('MyAttribute')?.resolver.write(this.__myAttributeValue);
                });
                // Mark event destroy function for destruction at detach of the control.
                this.__destroyOnDetach.push(destroy1);

                // Spinbox 2
                const destroy2 = TcHmi.EventProvider.register(`${this.getId()}.SpinboxInput_2.onValueChanged`, (data) => {
                    if (!this.__myAttributeValue) {
                        return;
                    }
                    // Read current value from Spinbox and forward it to the current value of MyAttribute.
                    const value = this.__spinBox2?.getValue();
                    if (value !== undefined && value !== null) {
                        this.__myAttributeValue.number2 = value;
                    }
                    // Write updated MyAttribute value to the attributes ObjectResolver instance.
                    // ObjectResolver will write back value changes of the given object paths with
                    // symbol expressions that have BindingMode=TwoWay back to the related symbol.
                    this.__objectResolvers.get('MyAttribute')?.resolver.write(this.__myAttributeValue, ["number2"]);
                });
                // Mark event destroy function for destruction at detach of the control.
                this.__destroyOnDetach.push(destroy2);

                // Spinbox 3
                const destroy3 = TcHmi.EventProvider.register(`${this.getId()}.SpinboxInput_3.onValueChanged`, (data) => {
                    if (!this.__myAttributeValue) {
                        return;
                    }
                    // Read current value from Spinbox and forward it to the current value of MyAttribute.
                    const value = this.__spinBox3?.getValue();
                    if (value !== undefined && value !== null) {
                        this.__myAttributeValue.number3 = value;
                    }
                    // Write updated MyAttribute value to the attributes ObjectResolver instance.
                    // ObjectResolver will write back value changes of the given object paths with
                    // symbol expressions that have BindingMode=TwoWay back to the related symbol.
                    this.__objectResolvers.get('MyAttribute')?.resolver.write(this.__myAttributeValue, ["number3"]);
                });
                // Mark event destroy function for destruction at detach of the control.
                this.__destroyOnDetach.push(destroy3);
            }

            /**
             * Is called by the system when the control instance is no longer part of the active DOM.
             * This function is only to be used by the System. Other function calls are not intended.
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

                // No need to destroy the Spinboxes here. Because they are defined in Template.html they are
                // defined as child controls of MyControl and will be automatically destroyed when MyControl is destroyed.
            }

            /**
             * Setter of MyAttribute attribute
             * @param valueNew
             */
            public setMyAttribute(valueNew: MyControl.MyObjectType | null) {
                let convertedValue = TcHmi.ValueConverter.toObject<MyControl.MyObjectType | null>(valueNew);
                if (convertedValue === null) {
                    convertedValue = this.getAttributeDefaultValueInternal('MyAttribute');
                }

                if (convertedValue === this.__myAttributeValue) {
                    return;
                }

                // Create an ObjectResolver for the new value of MyAttribute.

                // 1. Check for existing ObjectResolver instance for MyAttribute and destroy it and related resources.

                let resolverInfo = this.__objectResolvers.get('MyAttribute');

                if (resolverInfo) {
                    if (resolverInfo.watchDestroyer) {
                        resolverInfo.watchDestroyer();
                    }
                    resolverInfo.resolver.destroy();
                }

                // 2. Create a new ObjectResolver instance and related resources for the new value and add it to __objectResolvers.

                let resolver = new Symbol.ObjectResolver(convertedValue, this);

                this.__objectResolvers.set('MyAttribute', {
                    resolver: resolver,
                    watchCallback: this.__onMyAttributeWatchCallback,
                    watchDestroyer: resolver.watch(this.__onMyAttributeWatchCallback),
                });
            }

            /**
             * MyAttribute ObjectResolver watch callback
             * @param valueNew
             */
            @CallbackMethod
            protected __onMyAttributeWatchCallback(
                data: Symbol.ObjectResolver.IWatchResultObject<MyControl.MyObjectType | null>,
            ) {
                if (!this.__isAttached) {
                    // While not attached attribute should only be processed once during initializing phase.
                    this.__suspendObjectResolver('MyAttribute');
                }

                if (data.error !== TcHmi.Errors.NONE) {
                    return;
                }

                if (tchmi_equal(data.value, this.__myAttributeValue)) {
                    return;
                }

                this.__myAttributeValue = data.value;

                TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'MyAttribute' });

                this.__processMyAttribute();
            }

            /**
             * Getter of MyAttribute attribute
             */
            public getMyAttribute() {
                return this.__myAttributeValue;
            }

            /**
             * Process current MyAttribute value
             */
            protected __processMyAttribute() {
                if (this.__myAttributeValue) {
                    this.__spinBox1?.setValue(this.__myAttributeValue.number1 ?? null);
                    this.__spinBox2?.setValue(this.__myAttributeValue.number2 ?? null);
                    this.__spinBox3?.setValue(this.__myAttributeValue.number3 ?? null);
                } else {
                    this.__spinBox1?.setValue(null);
                    this.__spinBox2?.setValue(null);
                    this.__spinBox3?.setValue(null);
                }
            }
        }

        export namespace MyControl {
            export interface MyObjectType {
                number1: number;
                number2: number;
                number3: number;
            }
        }
    }
}

/*
 * Register Control
 */
TcHmi.Controls.registerEx('MyControl', 'TcHmi.Controls.MyPackage', TcHmi.Controls.MyPackage.MyControl);
