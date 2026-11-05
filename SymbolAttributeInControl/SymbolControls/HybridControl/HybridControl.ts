/*
 * Copyright (C) 2026
 */
// The control is an ES module: it imports the Framework API from the main export file of the Framework.
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import {
    Access,
    Binding,
    CallbackMethod,
    Controls,
    Errors,
    EventProvider,
    Log,
    Symbol,
    TcHmiControl,
    ValueConverter,
    type DestroyFunction,
} from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';

/**
 * Shows and toggles a boolean state like ClassicControl, but State is a plain Boolean value attribute.
 * It accepts a static value, and when it is bound to a symbol the control gets full control over that symbol:
 * the binding hands over its TcHmi.Symbol instead of writing the value ("bindableAsRef" in Description.json).
 * So the value attribute gets full control over the symbol like StateSymbol in ClassicControl, but without an
 * additional attribute which only accepts symbol references.
 */
export class HybridControl extends TcHmiControl.Control {
    /**
     * Constructor of the control
     * @param element Element from HTML (internal, do not use)
     * @param pcElement precompiled Element (internal, do not use)
     * @param attrs Attributes defined in HTML in a special format (internal, do not use)
     */
    constructor(element: JQuery, pcElement: JQuery, attrs: Controls.ControlAttributeList) {
        /** Call base class constructor */
        super(element, pcElement, attrs);
    }

    protected __elementTemplateRoot!: JQuery;
    protected __elementRow!: HTMLElement;
    protected __elementLabel!: HTMLElement;
    protected __elementState!: HTMLElement;

    /** Value of the State attribute. */
    protected __state: boolean | undefined;
    /** Symbol which a binding handed over for State, or null without a binding. The control owns it. */
    protected __stateSymbol: Symbol<boolean> | null = null;
    /** Destroys the watch of __stateSymbol. The watch only exists while the control is attached. */
    protected __destroyStateSymbolWatch: DestroyFunction | null = null;
    /** true after the symbol delivered a value. Only then the control writes to it. */
    protected __stateSymbolRead = false;
    /** Last value of the symbol, received from it or written to it. */
    protected __lastSymbolValue = false;
    /** true while a value of the symbol is applied, so setState does not write it back to the symbol. */
    protected __applyingSymbolValue = false;

    /**
     * Raised after the control was added to the control cache and the constructors of all base classes were called.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    public __previnit() {
        // Fetch template root element
        this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_SymbolControls_HybridControl-Template');
        if (this.__elementTemplateRoot.length === 0) {
            throw new Error('Invalid Template.html');
        }

        this.__elementRow = this.__elementTemplateRoot.find('.TcHmi_Controls_SymbolControls_HybridControl-row')[0];
        this.__elementLabel = this.__elementTemplateRoot.find('.TcHmi_Controls_SymbolControls_HybridControl-label')[0];
        this.__elementState = this.__elementTemplateRoot.find('.TcHmi_Controls_SymbolControls_HybridControl-state')[0];

        // A binding to a bindableAsRef attribute hands over its symbol on this event and passes null when it is
        // removed. Register it here and not in __init: the bindings are created between __previnit and __init.
        this.__destroyOnDestroy.push(
            EventProvider.register(
                this.__id + '.onAttributeSymbolReferenceChanged',
                (_event, data: { propertyName?: string; symbol?: Symbol<boolean> | null } | undefined) => {
                    this.__onAttributeSymbolReferenceChanged(data);
                },
            ),
        );

        // Call __previnit of base class
        super.__previnit();
    }

    /**
     * Is called during control initialization after the attribute setters have been called.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    public __init() {
        super.__init();
        this.__render();
    }

    /**
     * Is called by the system after the control instance is inserted into the active DOM.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    public __attach() {
        super.__attach();

        // With allowEarlySymbolReferenceInjection the symbol can arrive before it is resolved, so it is only
        // watched once the control is attached.
        if (this.__stateSymbol && !this.__destroyStateSymbolWatch) {
            this.__destroyStateSymbolWatch = this.__stateSymbol.watch(this.__onStateSymbolWatch);
        }

        const onClick = () => this.__toggle();
        this.__elementRow.addEventListener('click', onClick);
        this.__destroyOnDetach.push(() => this.__elementRow.removeEventListener('click', onClick));
    }

    /**
     * Is called by the system when the control instance is no longer part of the active DOM.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    public __detach() {
        super.__detach();

        // No subscription while the control is not visible. The symbol itself is kept for the next attach.
        this.__destroyStateSymbolWatch?.();
        this.__destroyStateSymbolWatch = null;
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

        this.__releaseStateSymbol();

        super.destroy();
    }

    /**
     * Setter of the State attribute. It only receives values: a static value, a value written by code or an
     * action, or a value of the symbol which the control applies itself.
     * @param valueNew The new state or null for the default.
     */
    public setState(valueNew: boolean | null) {
        let convertedValue = ValueConverter.toBoolean(valueNew);
        if (convertedValue === null) {
            convertedValue = this.getAttributeDefaultValueInternal<boolean>('State') ?? false;
        }

        if (convertedValue === this.__state) {
            return;
        }

        this.__state = convertedValue;
        this.__render();

        EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'State' });

        // A change from any other source than the symbol goes back to the symbol, like a TwoWay binding does.
        if (!this.__applyingSymbolValue) {
            this.__writeStateSymbol(convertedValue);
        }
    }

    /**
     * Getter of the State attribute.
     */
    public getState() {
        return this.__state;
    }

    /**
     * Takes over the symbol which a binding hands over for State, or releases it when the binding is removed.
     * @param data The name of the attribute and the symbol, or a null symbol on release.
     */
    protected __onAttributeSymbolReferenceChanged(
        data: { propertyName?: string; symbol?: Symbol<boolean> | null } | undefined,
    ) {
        if (data?.propertyName !== 'State') {
            return;
        }

        this.__releaseStateSymbol();

        if (!data.symbol) {
            // The binding was removed. Without a symbol the attribute shows its default again.
            this.setState(null);
            this.__render();
            return;
        }

        this.__stateSymbol = data.symbol;
        if (this.__isAttached) {
            this.__destroyStateSymbolWatch = this.__stateSymbol.watch(this.__onStateSymbolWatch);
        }
        this.__render();
    }

    /**
     * Stops the watch and destroys the symbol of State, if any.
     */
    protected __releaseStateSymbol() {
        // Destroy the watch before the symbol. Destroying a symbol does not end its watches, only the destroy function
        // of a watch does. In destroy() this runs before super.destroy() ends the watch by calling __detach().
        this.__destroyStateSymbolWatch?.();
        this.__destroyStateSymbolWatch = null;
        this.__stateSymbol?.destroy();
        this.__stateSymbol = null;
        this.__stateSymbolRead = false;
    }

    /**
     * Watch callback of the symbol of State. Called with the current value and with every change.
     * @param data The value of the symbol or an error.
     */
    @CallbackMethod
    protected __onStateSymbolWatch(data: Symbol.IReadResultObject<boolean>) {
        if (data.error !== Errors.NONE) {
            // The current value is unknown. Do not write until the symbol delivers a value again.
            this.__stateSymbolRead = false;
            Log.Controls.error(
                this,
                'TcHmi.Controls.SymbolControls.HybridControl',
                { Attribute: 'State', Symbol: this.__stateSymbol?.getExpression().toString() },
                `Watching the symbol failed with error: ${Log.buildMessage(data.details)}`,
            );
            this.__render();
            return;
        }

        this.__stateSymbolRead = true;
        this.__applySymbolValue(data.value === true);
    }

    /**
     * Applies a value of the symbol through the setter without writing it back.
     * @param value The value of the symbol.
     */
    protected __applySymbolValue(value: boolean) {
        this.__lastSymbolValue = value;
        this.__applyingSymbolValue = true;
        try {
            this.setState(value);
        } finally {
            this.__applyingSymbolValue = false;
        }
        this.__render();
    }

    /**
     * Writes a new state to the symbol, but only with a binding in BindingMode TwoWay.
     * @param value The new state.
     */
    protected __writeStateSymbol(value: boolean) {
        if (!this.__attributesInitialized) {
            // Values during the attribute phase come from the HTML or the defaults, never from the user.
            return;
        }
        if (!this.__stateSymbol || !this.__stateSymbolRead) {
            // Without a value of the symbol the control would overwrite it with a value it never read.
            return;
        }
        if (Binding.resolveEx('State', this)?.getOptions().BindingMode !== 'TwoWay') {
            // A OneWay binding only reads. The control keeps the value until the symbol changes the next time.
            return;
        }

        const symbol = this.__stateSymbol;
        const previousSymbolValue = this.__lastSymbolValue;
        this.__lastSymbolValue = value;
        symbol.write(value, (data) => {
            if (data.error !== Errors.NONE) {
                Log.Controls.error(
                    this,
                    'TcHmi.Controls.SymbolControls.HybridControl',
                    { Attribute: 'State', Symbol: symbol.getExpression().toString() },
                    `Writing the symbol failed with error: ${Log.buildMessage(data.details)}`,
                );
                // Show the value of the symbol again, like symbolWriteError=ReadBack does for a binding.
                if (symbol === this.__stateSymbol) {
                    this.__applySymbolValue(previousSymbolValue);
                }
            }
        });
    }

    /**
     * Inverts the state on a click.
     */
    protected __toggle() {
        if (!this.getIsEnabled() || Access.checkAccess(this, 'operate') !== true) {
            return;
        }
        this.setState(!this.__state);
    }

    /**
     * Shows the source and the value of State.
     */
    protected __render() {
        this.__elementLabel.textContent = this.__stateSymbol
            ? (this.__stateSymbol.getExpression().getName() ?? '')
            : 'Static value';
        const known = !this.__stateSymbol || this.__stateSymbolRead;
        this.__elementState.textContent = known ? (this.__state ? 'ON' : 'OFF') : '-';
        this.__elementRow.classList.toggle('on', known && this.__state === true);
    }
}

/*
 * Register Control
 */
Controls.registerEx('HybridControl', 'TcHmi.Controls.SymbolControls', HybridControl);
