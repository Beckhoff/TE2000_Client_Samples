// This code-behind file fills the result tables in Pages/Filtering.content.
// It is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Controls, Errors, EventProvider, Log, Server } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';
import type { TcHmiDatagrid, TcHmiTextblock } from 'Beckhoff.TwinCAT.HMI.Controls/index.esm.js';

/** Item of the server symbol LoremIpsumItems. */
type LoremIpsumItem = {
    text: string;
    properties: {
        length: number;
        hasUppercase: boolean;
        chars: string[];
    };
};

/** Converts an item of LoremIpsumItems to a row of the result tables. */
const toItemRow = (item: LoremIpsumItem) => ({
    text: item.text,
    length: item.properties.length,
    hasUppercase: item.properties.hasUppercase,
});

// Filtering strings by value with JSON object syntax in a subscription:
// The subscription is created when the table is attached to the DOM and removed when it is detached,
// so it only exists while the page is shown.

/** Id of the subscription. Only set while FilteringValueGrid is attached. */
let valueFilterSubscriptionId: number | null = null;

EventProvider.register('FilteringValueGrid.onAttached', () => {
    const command: Server.ICommand<unknown, string[]> = {
        symbol: 'LoremIpsum', // The symbol you want to subscribe to
        // The filter can be specified in JSON object syntax or string syntax.
        // This is JSON object syntax, the next example uses string syntax.
        filter: [
            {
                path: '{value}', // The array contains strings, so {value} refers to the strings themselves
                comparator: 'contains', // How to compare the value in the array and the reference value
                value: 'em', // The reference value
            },
        ],
        filterMap: [], // Asks the server for the original index of each item
    };

    valueFilterSubscriptionId = Server.subscribe<string[]>(
        [command], // It is possible to subscribe to multiple commands simultaneously, so the command has to be wrapped in an array
        500, // The polling interval of the subscription
        (data) => {
            // Called every time the value on the server changes
            showResult('FilteringValue', data, (value) => ({ value }));
        }
    );
});

EventProvider.register('FilteringValueGrid.onDetached', () => {
    if (valueFilterSubscriptionId !== null) {
        Server.unsubscribe(valueFilterSubscriptionId);
        valueFilterSubscriptionId = null;
    }
});

// Filtering structs by a property with string syntax in a ReadWrite request:
// The request reads the items once, every time the table is attached.

EventProvider.register('FilteringPropertyGrid.onAttached', () => {
    const command: Server.ICommand<unknown, LoremIpsumItem[]> = {
        symbol: 'LoremIpsumItems', // The symbol you want to read
        // Matches all items whose property hasUppercase in the struct properties is true.
        // Nested properties are separated by ::.
        filter: 'properties::hasUppercase == true',
        filterMap: [], // Asks the server for the original index of each item
    };

    Server.request<unknown, LoremIpsumItem[]>(
        {
            requestType: 'ReadWrite', // The Server.request function takes the complete request
            commands: [command],
        },
        (data) => {
            // Called only once
            showResult('FilteringProperty', data, toItemRow);
        }
    );
});

// Combining multiple filter criteria with JSON object syntax in a subscription:

/** Id of the subscription. Only set while FilteringCombinedGrid is attached. */
let combinedFilterSubscriptionId: number | null = null;

EventProvider.register('FilteringCombinedGrid.onAttached', () => {
    const command: Server.ICommand<unknown, LoremIpsumItem[]> = {
        symbol: 'LoremIpsumItems', // The symbol you want to subscribe to
        filter: [
            {
                path: 'properties::hasUppercase',
                comparator: '==',
                value: true,
            },
            {
                logic: 'OR', // Filters can be combined with OR or AND logic
            },
            // Filters can be nested to indicate precedence. Nested filters are evaluated first.
            [
                {
                    path: 'properties::chars[1]', // Array items are accessed by their index
                    comparator: '==',
                    value: 'o',
                },
                {
                    logic: 'AND',
                },
                {
                    path: 'properties::length',
                    comparator: '>=',
                    value: 6,
                },
            ],
        ],
        filterMap: [], // Asks the server for the original index of each item
    };

    combinedFilterSubscriptionId = Server.subscribe<LoremIpsumItem[]>([command], 500, (data) => {
        showResult('FilteringCombined', data, toItemRow);
    });
});

EventProvider.register('FilteringCombinedGrid.onDetached', () => {
    if (combinedFilterSubscriptionId !== null) {
        Server.unsubscribe(combinedFilterSubscriptionId);
        combinedFilterSubscriptionId = null;
    }
});

// Combining multiple filter criteria with string syntax in a ReadWrite request:

EventProvider.register('FilteringStringGrid.onAttached', () => {
    const command: Server.ICommand<unknown, LoremIpsumItem[]> = {
        symbol: 'LoremIpsumItems', // The symbol you want to read
        // The same filter as above in string syntax
        filter:
            'properties::hasUppercase == true || ' +
            '(properties::chars[1] == "o" && properties::length >= 6)',
        filterMap: [], // Asks the server for the original index of each item
    };

    Server.request<unknown, LoremIpsumItem[]>({ requestType: 'ReadWrite', commands: [command] }, (data) => {
        showResult('FilteringString', data, toItemRow);
    });
});

/**
 * Shows the items of a response in the table <prefix>Grid and their number in <prefix>Label.
 * readValue holds the requested items, maxEntries the number of items which match the filter
 * and filterMap the original index of each item.
 */
function showResult<T>(prefix: string, data: Server.IResultObject<unknown, T[]>, toRow: (item: T) => object) {
    const command = data.response?.commands?.[0];
    if (data.error !== Errors.NONE || !command || command.error || !command.readValue) {
        Log.errorEx('SymbolPaging: Reading %s failed: %s', prefix, Log.buildMessage(data.details ?? command?.error));
        return;
    }

    const grid = Controls.get<TcHmiDatagrid.Control>(prefix + 'Grid');
    const label = Controls.get<TcHmiTextblock.Control>(prefix + 'Label');
    grid?.setSrcData(command.readValue.map((item, i) => ({ index: command.filterMap?.[i], ...toRow(item) })));
    label?.setText(`Result: ${command.readValue.length} of ${command.maxEntries} items`);
}
