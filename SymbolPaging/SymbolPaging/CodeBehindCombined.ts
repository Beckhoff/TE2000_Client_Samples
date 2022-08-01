module TcHmi {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    var destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', function (e, data) {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();

        const textblock = Controls.get<Controls.Beckhoff.TcHmiTextbox>('TextblockCombined');

        if (!textblock) {
            return;
        }

        const subscriptionCommand: Server.ICommand = {
            symbol: 'PLC1.MAIN.loremIpsumItems', // The symbol you want to subscribe to
            offset: 10, // The starting index from which to read
            limit: 20, // How many items of the array to read
            orderBy: 'properties::length DESC, text ASC', // The sort order is defined as a string containing a path to a property or {value} and the sort order (ASC or DESC).
                                                          // Multiple sort criteria can be used by separating them with commas. Here we first sort by length, with the longest strings first,
                                                          // then alphabetically, so strings with the same length are sorted in ascending order.
            filter: 'properties::hasUppercase == false' // String syntax filter that matches all items where the hasUppercase field of the properties struct has the boolean value false
        };

        Server.subscribe<LoremIpsumItem[]>(
            [subscriptionCommand], // It is possible to subscribe to multiple commands simultaneously, so the command has to be wrapped in an array
            500, // The polling interval of the subscription
            (data) => { // The callback function receives the data from the server as its argument and is called every time the value on the server changes
                const readValue = data.response?.commands?.[0].readValue; // The paged data
                const maxEntries = data.response?.commands?.[0].maxEntries; // How many items of the array match the filter

                if (readValue) {
                    textblock.setText(readValue.map((item) => item.text).join('\n'));
                }
            }
        );

        type LoremIpsumItem = {
            text: string;
            properties: {
                length: number;
                hasUppercase: boolean;
                chars: string;
            }
        }
    });
}