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

            protected __spinBoxNumber1: TcHmi.Controls.Beckhoff.TcHmiSpinboxInput | undefined;
            protected __spinBoxNumber2: TcHmi.Controls.Beckhoff.TcHmiSpinboxInput | undefined;
            protected __spinBoxNumber3: TcHmi.Controls.Beckhoff.TcHmiSpinboxInput | undefined;

            /** Resolved value of MyAttribute. It is only replaced by the watch callback of the ObjectResolver. */
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
                this.__spinBoxNumber1 = TcHmi.Controls.get<TcHmi.Controls.Beckhoff.TcHmiSpinboxInput>(`${this.getId()}.SpinboxInput_number1`);
                this.__spinBoxNumber2 = TcHmi.Controls.get<TcHmi.Controls.Beckhoff.TcHmiSpinboxInput>(`${this.getId()}.SpinboxInput_number2`);
                this.__spinBoxNumber3 = TcHmi.Controls.get<TcHmi.Controls.Beckhoff.TcHmiSpinboxInput>(`${this.getId()}.SpinboxInput_number3`);

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

                // Each Spinbox edits one property of MyAttribute and writes it back when its value changes.
                // Mark the event destroy functions for destruction at detach of the control.
                this.__destroyOnDetach.push(
                    TcHmi.EventProvider.register(`${this.getId()}.SpinboxInput_number1.onValueChanged`, () => {
                        this.__writeMyAttributeProperty('number1', this.__spinBoxNumber1?.getValue());
                    }),
                    TcHmi.EventProvider.register(`${this.getId()}.SpinboxInput_number2.onValueChanged`, () => {
                        this.__writeMyAttributeProperty('number2', this.__spinBoxNumber2?.getValue());
                    }),
                    TcHmi.EventProvider.register(`${this.getId()}.SpinboxInput_number3.onValueChanged`, () => {
                        this.__writeMyAttributeProperty('number3', this.__spinBoxNumber3?.getValue());
                    }),
                );
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

                // No need to destroy the Spinboxes or the ObjectResolver here. The Spinboxes are defined in Template.html,
                // so they are child controls of MyControl and will be destroyed together with it.
                // The ObjectResolver is registered in __objectResolvers, so the base class destroys it.
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
                // The parent control delays the resolution of control symbols until the partial of the control is initialized.
                // The type of the attribute lets the resolver check and convert the resolved values.
                // The base class watches the resolvers in __objectResolvers again when the control is attached and destroys them with the control.

                let resolver = new TcHmi.ObjectResolver(convertedValue, {
                    parentControl: this,
                    type: this.getAttributeDescription('MyAttribute')?.type,
                });

                this.__objectResolvers.set('MyAttribute', {
                    resolver: resolver,
                    watchCallback: this.__onMyAttributeWatchCallback,
                    watchDestroyer: resolver.watch(this.__onMyAttributeWatchCallback),
                });
            }

            /**
             * MyAttribute ObjectResolver watch callback
             * @param data
             */
            @CallbackMethod
            protected __onMyAttributeWatchCallback(
                data: TcHmi.ObjectResolver.IWatchResultObject<MyControl.MyObjectType | null>,
            ) {
                if (!this.__isAttached) {
                    // While not attached attribute should only be processed once during initializing phase.
                    this.__suspendObjectResolver('MyAttribute');
                }

                if (data.error !== TcHmi.Errors.NONE) {
                    TcHmi.Log.Controls.error(
                        this,
                        'TcHmi.Controls.MyPackage.MyControl',
                        { Attribute: 'MyAttribute' },
                        `Resolving symbols from object failed with error: ${TcHmi.Log.buildMessage(data.details)}`,
                    );
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
                this.__spinBoxNumber1?.setValue(this.__myAttributeValue?.number1 ?? null);
                this.__spinBoxNumber2?.setValue(this.__myAttributeValue?.number2 ?? null);
                this.__spinBoxNumber3?.setValue(this.__myAttributeValue?.number3 ?? null);
            }

            /**
             * Writes a changed property of MyAttribute back through its ObjectResolver.
             * @param property The changed property
             * @param value The new value of the property
             */
            protected __writeMyAttributeProperty(property: keyof MyControl.MyObjectType, value: number | null | undefined) {
                const resolverInfo = this.__objectResolvers.get('MyAttribute');
                if (!resolverInfo || !this.__myAttributeValue || value === null || value === undefined) {
                    return;
                }

                // __processMyAttribute sets the values of the Spinboxes, which raises onValueChanged again. Skip it.
                if (this.__myAttributeValue[property] === value) {
                    return;
                }

                // Write a changed copy of the resolved value. The current value is not modified here. The ObjectResolver
                // reports the new value to the watch callback, which updates the control like for any other change.
                const valueNew: MyControl.MyObjectType = { ...this.__myAttributeValue, [property]: value };

                // Name the changed path. The ObjectResolver writes the value to the symbol behind the symbol expression
                // of this path if the expression uses BindingMode=TwoWay. Without dirty paths it compares the whole object
                // with its last value to find the changes.
                resolverInfo.resolver.write(valueNew, [property]);
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
