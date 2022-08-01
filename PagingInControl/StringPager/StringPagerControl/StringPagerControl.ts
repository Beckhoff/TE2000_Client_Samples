/*
 * Generated 7/16/2021 11:50:16 AM
 * Copyright (C) 2021
 */
module TcHmi {
    export module Controls {
        export module StringPager {
            export class StringPagerControl extends TcHmi.Controls.System.TcHmiControl {

                /*
                Attribute philosophy
                --------------------
                - Local variables are not set while definition in class, so they have the value 'undefined'.
                - On compile the Framework sets the value from HTML or from theme (possibly 'null') via normal setters.
                - The "changed detection" in the setter will result in processing the value only once while compile.
                - Attention: If we have a Server Binding on an Attribute the setter will be called once with null to initialize and later with the correct value.
                */

                /**
                 * Constructor of the control
                 * @param {JQuery} element Element from HTML (internal, do not use)
                 * @param {JQuery} pcElement precompiled Element (internal, do not use)
                 * @param {TcHmi.Controls.ControlAttributeList} attrs Attributes defined in HTML in a special format (internal, do not use)
                 * @returns {void}
                 */
                constructor(element: JQuery, pcElement: JQuery, attrs: TcHmi.Controls.ControlAttributeList) {
                    /** Call base class constructor */
                    super(element, pcElement, attrs);
                }

                protected __elementTemplateRoot!: HTMLElement;
                protected __elementItemContainer!: HTMLElement;
                protected __elementPageCounter!: HTMLElement;

                protected __prevButton!: Beckhoff.TcHmiButton;
                protected __nextButton!: Beckhoff.TcHmiButton;

                protected __editTextbox!: Beckhoff.TcHmiTextbox;

                protected __eventDestroyers: DestroyFunction[] = [];

                /** Internal reference to the attribute "data-tchmi-data-symbol" */
                protected __dataSymbol: Symbol<string[]> | undefined | null;

                /** Internal reference to the attribute "data-tchmi-items-per-page" */
                protected __itemsPerPage: number | undefined;
                protected __innerItemsPerPage = 1;

                protected __currentPage = 0;
                protected __subscriptionId: number | null = null;

				/**
                  * If raised, the control object exists in control cache and constructor of each inheritation level was called.
                  * Call attribute processor functions here to initialize default values!
                  */
                public __previnit() {
                    // Fetch template root element
                    this.__elementTemplateRoot = this.__element[0].getElementsByClassName('TcHmi_Controls_StringPager_StringPagerControl-Template')[0] as HTMLElement;
                    if (!this.__elementTemplateRoot) {
                        throw new Error('Invalid Template.html');
                    }

                    this.__elementItemContainer = this.__elementTemplateRoot.getElementsByClassName('TcHmi_Controls_StringPager_StringPagerControl-Template-item-container')[0] as HTMLElement;
                    this.__elementPageCounter = this.__elementTemplateRoot.getElementsByClassName('TcHmi_Controls_StringPager_StringPagerControl-Template-page-counter')[0] as HTMLElement;

                    const prevButton = Controls.get<Beckhoff.TcHmiButton>(this.getId() + '_PrevButton');
                    const nextButton = Controls.get<Beckhoff.TcHmiButton>(this.getId() + '_NextButton');

                    const editTextbox = TcHmi.ControlFactory.createEx<Beckhoff.TcHmiTextbox>(
                        'TcHmi.Controls.Beckhoff.TcHmiTextbox',
                        `${this.__id}.editTextbox`,
                        {
                            'data-tchmi-content-padding': {
                                left: 5,
                                top: 5,
                                right: 5,
                                bottom: 5
                            }
                        },
                        this);

                    if (!this.__elementItemContainer || !this.__elementPageCounter || !prevButton || !nextButton) {
                        throw new Error('Invalid Template.html');
                    }

                    if (!editTextbox) {
                        throw new Error('Could not create Textbox control');
                    }

                    this.__prevButton = prevButton;
                    this.__nextButton = nextButton;

                    this.__editTextbox = editTextbox;

                    // Call __previnit of base class
                    super.__previnit();
                }
                /** 
                 * Is called during control initialize phase after attribute setter have been called based on it's default or initial html dom values. 
                 * @returns {void}
                 */
                public __init() {
                    super.__init();
                }

                /**
                * Is called by tachcontrol() after the control instance gets part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                public __attach() {
                    super.__attach();

                    /**
                     * Initialize everything which is only available while the control is part of the active dom.
                     */

                    this.__eventDestroyers.push(EventProvider.register(this.__prevButton.getId() + '.onPressed', this.__onPrevPressed));
                    this.__eventDestroyers.push(EventProvider.register(this.__nextButton.getId() + '.onPressed', this.__onNextPressed));

                    this.__elementItemContainer.addEventListener('click', this.__onItemClicked, { passive: true });

                    this.__eventDestroyers.push(EventProvider.register(this.__editTextbox.getId() + '.onUserInteractionFinished', this.__onEditInteractionFinished));

                    this.__subscribeToDataSymbol();
                }

                /**
                * Is called by tachcontrol() after the control instance is no longer part of the current DOM.
                * Is only allowed to be called from the framework itself!
                */
                public __detach() {
                    super.__detach();

                    /**
                     * Disable everything which is not needed while the control is not part of the active dom.
                     * No need to listen to events for example!
                     */

                    for (const destroy of this.__eventDestroyers) {
                        destroy();
                    }
                    this.__eventDestroyers = [];

                    this.__elementItemContainer.removeEventListener('click', this.__onItemClicked);

                    this.__unsubscribeFromDataSymbol();
                }

                /**
                * Destroy the current control instance. 
                * Will be called automatically if system destroys control!
                */
                public destroy() {
                    /**
                    * While __keepAlive is set to true control must not be destroyed.
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
                 * Unsubscribes the current subscription and creates a new one with updated values.
                 */
                protected __updateSubscription() {
                    this.__unsubscribeFromDataSymbol();
                    this.__subscribeToDataSymbol();
                }

                /**
                 * Creates a new subscription to the data symbol, with offset, limit, filter and sorting applied according to the current attribute values and current page.
                 */
                protected __subscribeToDataSymbol() {
                    if (TCHMI_DESIGNER) {
                        return; // Don't subscribe to server symbols in the designer.
                    }

                    if (!this.__isAttached) {
                        return; // Only subscribe if the control is attached to avoid unnecessary load.
                    }

                    if (!this.__dataSymbol) {
                        return; // We cannot subscribe if we don't have a symbol to subscribe to.
                    }

                    if (this.__subscriptionId !== null) {
                        return; // We are already subscribed.
                    }

                    const expression = this.__dataSymbol.getExpression();

                    if (expression.getType() === SymbolType.Server) { // Only symbols of type server can be paged server-side.
                        const expressionName = expression.getName();
                        if (!expressionName) {
                            if (TCHMI_CONSOLE_LOG_LEVEL >= TcHmi.System.LOG_LEVEL.Error) {
                                TcHmi.Log.error(`[Source=Control, Module=${this.__type}, Id=${this.getId()}, Property=DataSymbol, Symbol=${this.__dataSymbol?.getExpression().toString()}] DataSymbol is missing a name.`);
                            }
                            return;
                        }

                        // Build the subscription command object
                        const command: Server.ICommand = {
                            commandOptions: ['SendErrorMessage'], // Basic command options. In this case we want to receive error messages as strings in addition to the numerical codes.

                            symbol: expressionName, // The symbol name as a string.

                            offset: this.__currentPage * this.__innerItemsPerPage, // The index of the first item we want to receive.

                            limit: this.__innerItemsPerPage, // How many items we want to receive.

                            filterMap: [] // Pass an empty array to the server to signal that we want to receive a filled filterMap in the response.
                                          // If this property is not set, the server response will not contain a filter map.
                                          // The filterMap contains the original indices of the values in readValue, before they were filtered, sorted and paged.
                                          // We need to know these indices if we want to write data back to the symbol.
                        };

                        // Send the subscription command to the server
                        this.__subscriptionId = TcHmi.Server.subscribeEx<string[]>(
                            [
                                command // subscribeEx can take an array of commands to subscribe to multiple symbols simultaneously. In this case we only need one command though.
                            ],
                            expression.getOptions().Interval ?? TcHmi.Config.get().tcHmiServer.websocketIntervalTime, // Check if the symbol has an interval configured. If not use the default interval from tchmiconfig.
                            null, // Use default request options
                            this.__onDataSymbolPage // The callback that receives the data from the server
                        );
                    }
                    else {
                        // Handle symbol types that cannot be paged server-side.
                        // This could be done by calling this.__dataSymbol.watch(watchCallback) and doing the paging manually in watchCallback.
                    }
                }

                /**
                 * Unsubscribes from the data symbol.
                 */
                protected __unsubscribeFromDataSymbol() {
                    if (this.__subscriptionId !== null) {
                        Server.unsubscribeEx(this.__subscriptionId, null, (data) => {
                            if (data.error !== TcHmi.Errors.NONE) {
                                if (TCHMI_CONSOLE_LOG_LEVEL >= TcHmi.System.LOG_LEVEL.Error) {
                                    TcHmi.Log.error(`[Source=Control, Module=${this.__type}, Id=${this.getId()}, Property=DataSymbol, Symbol=${this.__dataSymbol?.getExpression().toString()}] ` + Log.buildMessage(data.details));
                                }
                            }
                        });

                        this.__subscriptionId = null;
                    }
                }

                /**
                 * Writes the given value to the specified index of the data symbol.
                 * @param index The index to write to.
                 * @param value The value to write.
                 */
                protected __writeToDataSymbol(index: number, value: string) {
                    if (!this.__dataSymbol) {
                        return;
                    }

                    const expression = this.__dataSymbol.getExpression();

                    if (expression.getType() !== SymbolType.Server) {
                        // This sample focusses on server symbols
                        return;
                    }

                    // Simply concatenate the symbol name with the index in brackets
                    const symbol = expression.getName() + '[' + index + ']';

                    TcHmi.Server.writeSymbolEx(symbol, value, null, (data) => {
                        this.__checkServerResult(data);
                    })
                }

                /**
                 * Callback for the data symbol subscription.
                 * @param data The data received from the server.
                 */
                protected __onDataSymbolPage = (data: Server.IResultObject<unknown, string[]>) => {
                    const checkedData = this.__checkServerResult(data);

                    if (checkedData.hasError) {
                        return;
                    }

                    this.__updateDisplay(checkedData.readValue, checkedData.command.maxEntries ?? checkedData.readValue.length, checkedData.command.filterMap);
                };

                /**
                 * Check the given server result object for errors. A server result object can contain multiple commands but this function is designed to check only the first command.
                 * If an error is found print it to the console, if not return the first command and its readValue.
                 * @param data The server result object.
                 */
                protected __checkServerResult<W = any, R = W>(data: Server.IResultObject<W, R>): { hasError: true; } | { hasError: false; command: Server.ICommand<W, R>; readValue: R; } {
                    if (data.error !== TcHmi.Errors.NONE) {
                        if (TCHMI_CONSOLE_LOG_LEVEL >= TcHmi.System.LOG_LEVEL.Error) {
                            TcHmi.Log.error(`[Source=Control, Module=${this.__type}, Id=${this.getId()}, Property=DataSymbol, Symbol=%s%${this.__dataSymbol?.getExpression().toString()}%/s%] ` + Log.buildMessage(data.details));
                        }
                        return { hasError: true };
                    }
                    if (!data.response) {
                        TcHmi.Log.error(`[Source=Control, Module=${this.__type}, Id=${this.getId()}, Property=DataSymbol, Symbol=%s%${this.__dataSymbol?.getExpression().toString()}%/s%] ` + Log.buildMessage({
                            code: TcHmi.Errors.E_SERVER_RESPONSE_MISSING,
                            message: TcHmi.Errors[TcHmi.Errors.E_SERVER_RESPONSE_MISSING],
                            reason: 'Missing response from server.',
                            domain: this.__type
                        }));
                        return { hasError: true };
                    }
                    if (data.response.error) {
                        if (TCHMI_CONSOLE_LOG_LEVEL >= TcHmi.System.LOG_LEVEL.Error) {
                            TcHmi.Log.error(`[Source=Control, Module=${this.__type}, Id=${this.getId()}, Property=DataSymbol, Symbol=%s%${this.__dataSymbol?.getExpression().toString()}%/s%] ` + Log.buildMessage(data.response.error));
                        }
                        return { hasError: true };
                    }
                    if (!data.response.commands || data.response.commands.length === 0) {
                        TcHmi.Log.error(`[Source=Control, Module=${this.__type}, Id=${this.getId()}, Property=DataSymbol, Symbol=%s%${this.__dataSymbol?.getExpression().toString()}%/s%] ` + Log.buildMessage({
                            code: TcHmi.Errors.E_SERVER_COMMANDS_MISSING,
                            message: TcHmi.Errors[TcHmi.Errors.E_SERVER_COMMANDS_MISSING],
                            reason: 'Missing commands in response from server with id: \'' + data.response.id + '\'.',
                            domain: this.__type
                        }));
                        return { hasError: true };
                    }

                    const command = data.response.commands[0];

                    if (command.error) {
                        if (TCHMI_CONSOLE_LOG_LEVEL >= TcHmi.System.LOG_LEVEL.Error) {
                            TcHmi.Log.error(`[Source=Control, Module=${this.__type}, Id=${this.getId()}, Property=DataSymbol, Symbol=%s%${this.__dataSymbol?.getExpression().toString()}%/s%] ` + Log.buildMessage(command.error));
                        }
                        return { hasError: true };
                    }
                    if (!command.readValue) {
                        TcHmi.Log.error(`[Source=Control, Module=${this.__type}, Id=${this.getId()}, Property=DataSymbol, Symbol=%s%${this.__dataSymbol?.getExpression().toString()}%/s%] ` + Log.buildMessage({
                            code: TcHmi.Errors.E_SERVER_READVALUE_MISSING,
                            message: TcHmi.Errors[TcHmi.Errors.E_SERVER_READVALUE_MISSING],
                            reason: 'Missing read value in response from server with id: \'' + data.response.id + '\'.',
                            domain: this.__type
                        }));
                        return { hasError: true };
                    }

                    return {
                        hasError: false,
                        command: command,
                        readValue: command.readValue
                    };
                }

                /**
                 * Updates the items in itemContainer, the page counter and the button enabled states.
                 * @param items The new items to display.
                 * @param maxItems The number of available items in total.
                 */
                protected __updateDisplay(items: string[], maxItems: number, filterMap?: number[]) {
                    const fragment = document.createDocumentFragment();

                    for (let i = 0; i < items.length; i++) {
                        const itemDiv = document.createElement('div');
                        itemDiv.textContent = items[i];

                        const index = filterMap?.[i];
                        if (index !== undefined) {
                            itemDiv.dataset.index = index.toString();
                        }

                        fragment.appendChild(itemDiv);
                    }

                    this.__elementItemContainer.innerHTML = '';
                    this.__elementItemContainer.appendChild(fragment);

                    const maxPages = Math.ceil(maxItems / this.__innerItemsPerPage);

                    this.__elementPageCounter.textContent = `${this.__currentPage + 1} / ${maxPages}`;

                    this.__prevButton.setIsEnabled(this.__currentPage > 0);
                    this.__nextButton.setIsEnabled(this.__currentPage < maxPages - 1);
                }

                /**
                 * Handles the pressed event of the previous button.
                 */
                protected __onPrevPressed = () => {
                    this.__currentPage--;
                    this.__updateSubscription();
                };

                /**
                 * Handles the pressed event of the next button.
                 */
                protected __onNextPressed = () => {
                    this.__currentPage++;
                    this.__updateSubscription();
                };

                /**
                 * Handles the click event of item divs.
                 * @param event The event data.
                 */
                protected __onItemClicked = (event: MouseEvent) => {
                    if (!TcHmi.Access.checkAccess(this, 'operate')) {
                        return;
                    }
                    if (!this.getIsEnabled()) {
                        return;
                    }

                    const itemDiv = event.target;

                    if (
                        !(itemDiv instanceof HTMLDivElement) ||
                        !itemDiv.dataset.index ||
                        !itemDiv.parentElement?.classList.contains('TcHmi_Controls_StringPager_StringPagerControl-Template-item-container')
                    ) {
                        return;
                    }

                    const textboxElement = this.__editTextbox.getElement()[0];

                    this.__editTextbox.setText(itemDiv.textContent);
                    itemDiv.textContent = '';
                    itemDiv.appendChild(textboxElement);

                    textboxElement.getElementsByTagName('input')[0]?.focus();
                };

                /**
                 * Handles the userInteractionFinished event of the edit textbox.
                 */
                protected __onEditInteractionFinished = () => {
                    const text = this.__editTextbox.getText() ?? '';
                    const textboxElement = this.__editTextbox.getElement()[0];
                    const itemDiv = textboxElement.parentElement;

                    if (!itemDiv || !itemDiv.dataset.index) {
                        return;
                    }

                    const index = parseInt(itemDiv.dataset.index, 10);
                    if (Number.isNaN(index) || index < 0) {
                        return;
                    }

                    textboxElement.remove();
                    itemDiv.textContent = text;

                    this.__writeToDataSymbol(index, text);
                };

                /**
                 * Sets the value of the member variable "dataSymbol" if the new value is not equal to the current value
                 * and calls the associated process function (processDataSymbol) after that.
                 * @param valueNew The new value for dataSymbol.
                 */
                public setDataSymbol(valueNew: TcHmi.Symbol<string[]> | null) {
                    if (valueNew === null) {
                        const symbolExpression = this.getAttributeDefaultValueInternal<string>('DataSymbol');
                        if (symbolExpression) {
                            valueNew = new TcHmi.Symbol(symbolExpression);
                        }
                    }

                    if (this.__dataSymbol === valueNew) {
                        return;
                    }

                    if (valueNew instanceof TcHmi.Symbol) {
                        this.__dataSymbol = valueNew;
                    }
                    else {
                        this.__dataSymbol = null;
                    }

                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'DataSymbol' });

                    this.__processDataSymbol();
                }

                /**
                 * Returns the current value of the member variable dataSymbol.
                 */
                public getDataSymbol() {
                    return this.__dataSymbol;
                }

                /**
                 * Processes the dataSymbol
                 */
                protected __processDataSymbol() {
                    this.__currentPage = 0;
                    this.__updateSubscription();
                }

                /**
                 * Sets the value of the member variable "itemsPerPage" if the new value is not equal to the current value
                 * and calls the associated process function (processItemsPerPage) after that.
                 * @param valueNew The new value for itemsPerPage.
                 */
                public setItemsPerPage(valueNew: number | null) {
                    const convertedValue = TcHmi.ValueConverter.toNumber(valueNew, this.getAttributeDefaultValueInternal('ItemsPerPage') as number);

                    if (convertedValue === this.__itemsPerPage) {
                        return;
                    }

                    this.__itemsPerPage = convertedValue;

                    TcHmi.EventProvider.raise(this.__id + '.onPropertyChanged', { propertyName: 'ItemsPerPage' });

                    this.__processItemsPerPage();
                }

                /**
                 * Returns the current value of the member variable itemsPerPage.
                 */
                public getItemsPerPage() {
                    return this.__itemsPerPage;
                }

                /**
                 * Processes the current value of itemsPerPage
                 */
                protected __processItemsPerPage() {
                    this.__innerItemsPerPage = this.__itemsPerPage && this.__itemsPerPage > 0 ? this.__itemsPerPage : 1;
                    this.__currentPage = 0; // Reset to zero so we don't end up on a page that is beyond the end of the data when increasing itemsPerPage
                    this.__updateSubscription();
                }
            }
        }
    }
}
/**
* Register Control
*/
TcHmi.Controls.registerEx('StringPagerControl', 'TcHmi.Controls.StringPager', TcHmi.Controls.StringPager.StringPagerControl);
