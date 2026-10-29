// This code-behind file fills the result table in Pages/Combined.content.
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

// Filtering, sorting and paging in one subscription:
// The server filters the array first, then sorts the matching items and finally returns the requested page.
// The subscription is created when the table is attached to the DOM and removed when it is detached,
// so it only exists while the page is shown.

/** Id of the subscription. Only set while CombinedGrid is attached. */
let subscriptionId: number | null = null;

EventProvider.register('CombinedGrid.onAttached', () => {
    const command: Server.ICommand<unknown, LoremIpsumItem[]> = {
        symbol: 'LoremIpsumItems', // The symbol you want to subscribe to
        filter: 'properties::hasUppercase == false', // Matches all items which start with a lowercase letter
        orderBy: 'properties::length DESC, text ASC', // Longest strings first, then alphabetically
        offset: 10, // The index of the first item to read, counted in the filtered and sorted items
        limit: 20, // How many items to read
        filterMap: [], // Asks the server for the original index of each item
    };

    subscriptionId = Server.subscribe<LoremIpsumItem[]>(
        [command], // It is possible to subscribe to multiple commands simultaneously, so the command has to be wrapped in an array
        500, // The polling interval of the subscription
        (data) => {
            // Called every time the value on the server changes
            showResult('Combined', data, (item) => ({
                text: item.text,
                length: item.properties.length,
                hasUppercase: item.properties.hasUppercase,
            }));
        }
    );
});

EventProvider.register('CombinedGrid.onDetached', () => {
    if (subscriptionId !== null) {
        Server.unsubscribe(subscriptionId);
        subscriptionId = null;
    }
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
