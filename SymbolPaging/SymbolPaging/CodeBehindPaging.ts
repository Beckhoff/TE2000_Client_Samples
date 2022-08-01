module TcHmi {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    var destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', function (e, data) {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();

        const textblockSubscription = Controls.get<Controls.Beckhoff.TcHmiTextbox>('TextblockPagingSubscription');
        const textblockReadWrite = Controls.get<Controls.Beckhoff.TcHmiTextbox>('TextblockPagingReadWrite');

        if (!textblockSubscription || !textblockReadWrite) {
            return;
        }

        // Using paging in a subscription:

        const subscriptionCommand: Server.ICommand = {
            symbol: 'PLC1.MAIN.loremIpsum', // The symbol you want to subscribe to
            offset: 10, // The starting index from which to read
            limit: 20 // How many items of the array to read
        };

        Server.subscribe<string[]>(
            [subscriptionCommand], // It is possible to subscribe to multiple commands simultaneously, so the command has to be wrapped in an array
            500, // The polling interval of the subscription
            (data) => { // The callback function receives the data from the server as its argument and is called every time the value on the server changes
                const readValue = data.response?.commands?.[0].readValue; // The paged data
                const maxEntries = data.response?.commands?.[0].maxEntries; // How many items the array holds in total

                if (readValue) {
                    textblockSubscription.setText(readValue.join(' '));
                }
            }
        );



        // Using paging in a readWrite request:

        const readWriteCommand: Server.ICommand = {
            symbol: 'PLC1.MAIN.loremIpsum', // The symbol you want to read
            offset: 30, // The starting index from which to read
            limit: 10 // How many items of the array to read
        };

        const readWriteRequest: Server.IMessage = { // The Server.request function takes the complete request as its argument, so the request is defined here
            requestType: 'ReadWrite', // The type of request
            commands: [
                readWriteCommand // The readWrite command that was defined earlier
            ]
        };

        Server.request<string[]>(
            readWriteRequest,
            (data) => { // The callback function receives the data from the server as its argument and is called only once
                const readValue = data.response?.commands?.[0].readValue;  // The paged data
                const maxEntries = data.response?.commands?.[0].maxEntries; // How many items the array holds in total

                if (readValue) {
                    textblockReadWrite.setText(readValue.join(' '));
                }
            }
        );
    });
}