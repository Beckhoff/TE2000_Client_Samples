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
    ObjectResolver,
    Symbol,
    TcHmiControl,
    ValueConverter,
    type DestroyFunction,
} from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';

/**
 * Shows and toggles a list of boolean states. Each entry of the attribute Entries has a label and a state symbol.
 * The control resolves the attribute value with a TcHmi.ObjectResolver. The type of stateSymbol is Symbol, so the
 * resolver puts a TcHmi.Symbol instance into the entry instead of the value of the symbol.
 */
export class ObjectResolverControl extends TcHmiControl.Control {
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
    protected __elementRows!: HTMLElement;

    /** Resolved value of Entries. It is only replaced by the watch callback of the ObjectResolver. */
    protected __entries: ObjectResolverControl.Entry[] | null | undefined;
    /** One row per entry with the watch of its state symbol. */
    protected __rows: ObjectResolverControl.Row[] = [];

    /**
     * Raised after the control was added to the control cache and the constructors of all base classes were called.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    public __previnit() {
        // Fetch template root element
        this.__elementTemplateRoot = this.__element.find('.TcHmi_Controls_SymbolControls_ObjectResolverControl-Template');
        if (this.__elementTemplateRoot.length === 0) {
            throw new Error('Invalid Template.html');
        }

        this.__elementRows = this.__elementTemplateRoot.find('.TcHmi_Controls_SymbolControls_ObjectResolverControl-rows')[0];

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

        // The base class watches the ObjectResolver of Entries again. Its watch callback delivers the symbols
        // again and recreates the rows, which then watch their symbols.

        const onClick = (event: MouseEvent) => {
            const element = (event.target as HTMLElement).closest<HTMLElement>('[data-row-index]');
            if (element && this.__elementRows.contains(element)) {
                this.__toggle(this.__rows[Number(element.dataset.rowIndex)]);
            }
        };
        this.__elementRows.addEventListener('click', onClick);
        this.__destroyOnDetach.push(() => this.__elementRows.removeEventListener('click', onClick));
    }

    /**
     * Is called by the system when the control instance is no longer part of the active DOM.
     * This function is only to be used by the System. Other function calls are not intended.
     */
    public __detach() {
        // End the watches of the rows before super.__detach() stops the watch of the ObjectResolver, which destroys
        // the symbols it delivered. Destroying a symbol does not end its watches. The next attach delivers the symbols
        // again.
        this.__releaseRows();

        super.__detach();
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

        // Only the watches belong to the control. The symbols belong to the ObjectResolver, which the base class
        // destroys in super.destroy() because it is registered in __objectResolvers. End the watches before.
        this.__releaseRows();

        super.destroy();
    }

    /**
     * Setter of the Entries attribute.
     * @param valueNew The list of entries. stateSymbol of an entry contains a symbol expression.
     */
    public setEntries(valueNew: ObjectResolverControl.Entry[] | null) {
        let convertedValue = ValueConverter.toObject<ObjectResolverControl.Entry[] | null>(valueNew);
        if (convertedValue === null) {
            convertedValue = this.getAttributeDefaultValueInternal('Entries');
        }

        // Destroy the ObjectResolver of the previous value. It destroys the symbols it created, so the watches of the
        // rows end before: destroying a symbol does not end its watches.
        const resolverInfo = this.__objectResolvers.get('Entries');
        if (resolverInfo) {
            this.__releaseRows();
            resolverInfo.watchDestroyer?.();
            resolverInfo.resolver.destroy();
        }

        // The type of the attribute tells the resolver that stateSymbol expects a TcHmi.Symbol.
        // The base class watches the resolvers in __objectResolvers again when the control is attached and
        // destroys them with the control.
        const resolver = new ObjectResolver(convertedValue, {
            parentControl: this,
            type: this.getAttributeDescription('Entries')?.type,
        });

        this.__objectResolvers.set('Entries', {
            resolver: resolver,
            watchCallback: this.__onEntriesWatchCallback,
            watchDestroyer: resolver.watch(this.__onEntriesWatchCallback),
        });
    }

    /**
     * Getter of the Entries attribute.
     */
    public getEntries() {
        return this.__entries;
    }

    /**
     * Watch callback of the ObjectResolver of Entries.
     * @param data The resolved entries: stateSymbol is a TcHmi.Symbol.
     */
    @CallbackMethod
    protected __onEntriesWatchCallback(data: ObjectResolver.IWatchResultObject<ObjectResolverControl.Entry[] | null>) {
        if (!this.__isAttached) {
            // While not attached the attribute should only be processed once during the initializing phase.
            this.__suspendObjectResolver('Entries');
        }

        if (data.error !== Errors.NONE) {
            Log.Controls.error(
                this,
                'TcHmi.Controls.SymbolControls.ObjectResolverControl',
                { Attribute: 'Entries' },
                `Resolving the entries failed with error: ${Log.buildMessage(data.details)}`,
            );
            return;
        }

        this.__entries = data.value;

        EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'Entries' });

        this.__processEntries();
    }

    /**
     * Creates one row per entry and watches the state symbols of the entries.
     */
    protected __processEntries() {
        for (const row of this.__rows) {
            this.__unwatchRow(row);
        }
        this.__rows = [];
        this.__elementRows.replaceChildren();

        for (const [index, entry] of (this.__entries ?? []).entries()) {
            const element = document.createElement('div');
            element.className = 'TcHmi_Controls_SymbolControls_ObjectResolverControl-row';
            element.dataset.rowIndex = String(index);
            const lamp = document.createElement('div');
            lamp.className = 'TcHmi_Controls_SymbolControls_ObjectResolverControl-lamp';
            const label = document.createElement('div');
            label.className = 'TcHmi_Controls_SymbolControls_ObjectResolverControl-label';
            label.textContent = entry.label ?? '';
            const state = document.createElement('div');
            state.className = 'TcHmi_Controls_SymbolControls_ObjectResolverControl-state';
            element.append(lamp, label, state);
            this.__elementRows.append(element);

            const row: ObjectResolverControl.Row = {
                // The resolver delivers a TcHmi.Symbol for stateSymbol. Anything else, for example a missing
                // property, leaves the row without a symbol.
                symbol: entry.stateSymbol instanceof Symbol ? entry.stateSymbol : null,
                destroyWatch: null,
                state: false,
                read: false,
                element: element,
                elementState: state,
            };
            this.__rows.push(row);
            this.__renderRow(row);

            if (this.__isAttached) {
                this.__watchRow(row);
            }
        }
    }

    /**
     * Watches the state symbol of a row.
     * @param row The row.
     */
    protected __watchRow(row: ObjectResolverControl.Row) {
        if (!row.symbol || row.destroyWatch) {
            return;
        }
        const symbol = row.symbol;
        row.destroyWatch = symbol.watch((data) => {
            if (data.error !== Errors.NONE) {
                row.read = false;
                Log.Controls.error(
                    this,
                    'TcHmi.Controls.SymbolControls.ObjectResolverControl',
                    { Attribute: 'Entries', Symbol: symbol.getExpression().toString() },
                    `Watching the symbol failed with error: ${Log.buildMessage(data.details)}`,
                );
                this.__renderRow(row);
                return;
            }
            row.read = true;
            row.state = data.value === true;
            this.__renderRow(row);
        });
    }

    /**
     * Stops the watch of the state symbol of a row. The symbol itself belongs to the ObjectResolver.
     * @param row The row.
     */
    protected __unwatchRow(row: ObjectResolverControl.Row) {
        row.destroyWatch?.();
        row.destroyWatch = null;
    }

    /**
     * Ends the watches of all rows and forgets their symbols, before the ObjectResolver destroys the symbols.
     */
    protected __releaseRows() {
        for (const row of this.__rows) {
            this.__unwatchRow(row);
            row.symbol = null;
            row.read = false;
        }
    }

    /**
     * Writes the inverted state of a row to its symbol. The watch reports the new value, which updates the row.
     * @param row The row.
     */
    protected __toggle(row: ObjectResolverControl.Row | undefined) {
        if (!row?.symbol || !row.read) {
            return;
        }
        if (!this.getIsEnabled() || Access.checkAccess(this, 'operate') !== true) {
            return;
        }

        const symbol = row.symbol;
        symbol.write(!row.state, (data) => {
            if (data.error !== Errors.NONE) {
                Log.Controls.error(
                    this,
                    'TcHmi.Controls.SymbolControls.ObjectResolverControl',
                    { Attribute: 'Entries', Symbol: symbol.getExpression().toString() },
                    `Writing the symbol failed with error: ${Log.buildMessage(data.details)}`,
                );
            }
        });
    }

    /**
     * Shows the state of a row.
     * @param row The row.
     */
    protected __renderRow(row: ObjectResolverControl.Row) {
        row.elementState.textContent = row.read ? (row.state ? 'ON' : 'OFF') : '-';
        row.element.classList.toggle('on', row.read && row.state);
    }
}

export namespace ObjectResolverControl {
    /** An entry as the ObjectResolver delivers it. */
    export interface Entry {
        label: string;
        /** Configured as a symbol expression like %s%PumpRunning%/s%, delivered as TcHmi.Symbol. */
        stateSymbol: Symbol<boolean> | null;
    }

    /** A row of the control. */
    export interface Row {
        symbol: Symbol<boolean> | null;
        destroyWatch: DestroyFunction | null;
        state: boolean;
        read: boolean;
        element: HTMLElement;
        elementState: HTMLElement;
    }
}

/*
 * Register Control
 */
Controls.registerEx('ObjectResolverControl', 'TcHmi.Controls.SymbolControls', ObjectResolverControl);
