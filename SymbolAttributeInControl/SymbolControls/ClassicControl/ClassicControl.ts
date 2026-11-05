/*
 * Copyright (C) 2026
 */
// The control is an ES module: it imports the Framework API from the main export file of the Framework.
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import {
    Access,
    CallbackMethod,
    Controls,
    Errors,
    EventProvider,
    Log,
    Symbol,
    TcHmiControl,
    type DestroyFunction,
} from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';

/**
 * Shows and toggles a boolean state which is stored in a symbol.
 * The attribute StateSymbol has the type Symbol, so the control receives a TcHmi.Symbol instance instead of a value
 * and reads and writes the value of the symbol itself, like the StateSymbol of the TcHmiButton.
 */
export class ClassicControl extends TcHmiControl.Control {
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

    /** Symbol of the StateSymbol attribute. The control owns it and destroys it when it is replaced. */
    protected __stateSymbol: Symbol<boolean> | null | undefined;
    /** Destroys the watch of __stateSymbol. The watch only exists while the control is attached. */
    protected __destroyStateSymbolWatch: DestroyFunction | null = null;
    /** Last value of the symbol. */
    protected __state = false;
    /** true after the symbol delivered a value. Only then the control writes to it. */
    protected __stateSymbolRead = false;

    /**
     * Raised after the control was added to the control cache and the constructors of all base classes were called.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    public __previnit() {
        // Fetch template root element
        this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_SymbolControls_ClassicControl-Template');
        if (this.__elementTemplateRoot.length === 0) {
            throw new Error('Invalid Template.html');
        }

        this.__elementRow = this.__elementTemplateRoot.find('.TcHmi_Controls_SymbolControls_ClassicControl-row')[0];
        this.__elementLabel = this.__elementTemplateRoot.find('.TcHmi_Controls_SymbolControls_ClassicControl-label')[0];
        this.__elementState = this.__elementTemplateRoot.find('.TcHmi_Controls_SymbolControls_ClassicControl-state')[0];

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

        // A symbol is only watched while the control is attached. The watch subscribes to the symbol and reports
        // its current value and every change.
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

        // Destroy the watch before the symbol. Destroying a symbol does not end its watches, only the destroy function
        // of a watch does. super.destroy() also ends the watch by calling __detach(), but only after the symbol was
        // destroyed here, so the order is forced explicitly.
        this.__destroyStateSymbolWatch?.();
        this.__destroyStateSymbolWatch = null;
        this.__stateSymbol?.destroy();
        this.__stateSymbol = null;

        super.destroy();
    }

    /**
     * Setter of the StateSymbol attribute.
     * The Framework creates a TcHmi.Symbol for the symbol expression in the attribute and passes it here.
     * @param valueNew The new symbol or null.
     */
    public setStateSymbol(valueNew: Symbol<boolean> | null) {
        if (valueNew === this.__stateSymbol) {
            return;
        }

        // Release the previous symbol. The control owns the symbol it received. The watch ends first: destroying a
        // symbol does not end its watches.
        this.__destroyStateSymbolWatch?.();
        this.__destroyStateSymbolWatch = null;
        this.__stateSymbol?.destroy();

        this.__stateSymbol = valueNew instanceof Symbol ? valueNew : null;
        this.__stateSymbolRead = false;
        this.__state = false;

        if (this.__stateSymbol && this.__isAttached) {
            this.__destroyStateSymbolWatch = this.__stateSymbol.watch(this.__onStateSymbolWatch);
        }

        this.__render();

        EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'StateSymbol' });
    }

    /**
     * Getter of the StateSymbol attribute.
     */
    public getStateSymbol() {
        return this.__stateSymbol;
    }

    /**
     * Watch callback of the StateSymbol. Called with the current value and with every change.
     * @param data The value of the symbol or an error.
     */
    @CallbackMethod
    protected __onStateSymbolWatch(data: Symbol.IReadResultObject<boolean>) {
        if (data.error !== Errors.NONE) {
            // The current value is unknown. Do not write until the symbol delivers a value again.
            this.__stateSymbolRead = false;
            Log.Controls.error(
                this,
                'TcHmi.Controls.SymbolControls.ClassicControl',
                { Attribute: 'StateSymbol', Symbol: this.__stateSymbol?.getExpression().toString() },
                `Watching the symbol failed with error: ${Log.buildMessage(data.details)}`,
            );
            return;
        }

        this.__stateSymbolRead = true;
        this.__state = data.value === true;
        this.__render();
    }

    /**
     * Writes the inverted state to the symbol. The watch reports the new value, which updates the control.
     */
    protected __toggle() {
        if (!this.__stateSymbol || !this.__stateSymbolRead) {
            return;
        }
        if (!this.getIsEnabled() || Access.checkAccess(this, 'operate') !== true) {
            return;
        }

        const symbol = this.__stateSymbol;
        symbol.write(!this.__state, (data) => {
            if (data.error !== Errors.NONE) {
                Log.Controls.error(
                    this,
                    'TcHmi.Controls.SymbolControls.ClassicControl',
                    { Attribute: 'StateSymbol', Symbol: symbol.getExpression().toString() },
                    `Writing the symbol failed with error: ${Log.buildMessage(data.details)}`,
                );
            }
        });
    }

    /**
     * Shows the symbol and its state.
     */
    protected __render() {
        this.__elementLabel.textContent = this.__stateSymbol?.getExpression().getName() ?? 'No symbol';
        this.__elementState.textContent = this.__stateSymbolRead ? (this.__state ? 'ON' : 'OFF') : '-';
        this.__elementRow.classList.toggle('on', this.__stateSymbolRead && this.__state);
    }
}

/*
 * Register Control
 */
Controls.registerEx('ClassicControl', 'TcHmi.Controls.SymbolControls', ClassicControl);
