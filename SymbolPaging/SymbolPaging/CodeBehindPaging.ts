// This code-behind file fills the result tables in Pages/Paging.content.
// It is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Controls, Errors, EventProvider, Log, Server } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';
import type { TcHmiDatagrid, TcHmiTextblock } from 'Beckhoff.TwinCAT.HMI.Controls/index.esm.js';

// Using paging in a subscription:
// The subscription is created when the table is attached to the DOM and removed when it is detached,
// so it only exists while the page is shown.

/** Id of the subscription. Only set while PagingSubscriptionGrid is attached. */
let subscriptionId: number | null = null;

EventProvider.register('PagingSubscriptionGrid.onAttached', () => {
    const command: Server.ICommand<unknown, string[]> = {
        symbol: 'LoremIpsum', // The symbol you want to subscribe to
        offset: 10, // The index of the first item to read
        limit: 20, // How many items of the array to read
        filterMap: [], // Asks the server for the original index of each item
    };

    subscriptionId = Server.subscribe<string[]>(
        [command], // It is possible to subscribe to multiple commands simultaneously, so the command has to be wrapped in an array
        500, // The polling interval of the subscription
        (data) => {
            // Called every time the value on the server changes
            showResult('PagingSubscription', data, (value) => ({ value }));
        }
    );
});

EventProvider.register('PagingSubscriptionGrid.onDetached', () => {
    if (subscriptionId !== null) {
        Server.unsubscribe(subscriptionId);
        subscriptionId = null;
    }
});

// Using paging in a ReadWrite request:
// The request reads the items once, every time the table is attached.

EventProvider.register('PagingRequestGrid.onAttached', () => {
    const command: Server.ICommand<unknown, string[]> = {
        symbol: 'LoremIpsum', // The symbol you want to read
        offset: 30, // The index of the first item to read
        limit: 10, // How many items of the array to read
        filterMap: [], // Asks the server for the original index of each item
    };

    Server.request<unknown, string[]>(
        {
            requestType: 'ReadWrite', // The Server.request function takes the complete request
            commands: [command],
        },
        (data) => {
            // Called only once
            showResult('PagingRequest', data, (value) => ({ value }));
        }
    );
});

/**
 * Shows the items of a response in the table <prefix>Grid and their number in <prefix>Label.
 * readValue holds the requested items, maxEntries the number of items which match the request
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
