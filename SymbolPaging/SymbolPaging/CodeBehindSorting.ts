module TcHmi {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    var destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', function (e, data) {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();

        const textblockSubscription = Controls.get<Controls.Beckhoff.TcHmiTextbox>('TextblockSortingSubscription');
        const textblockReadWrite = Controls.get<Controls.Beckhoff.TcHmiTextbox>('TextblockSortingReadWrite');

        if (!textblockSubscription || !textblockReadWrite) {
            return;
        }

        // Sorting a string by value in a subscription:

        const subscriptionCommand: Server.ICommand = {
            symbol: 'PLC1.MAIN.jumbledAlphabet', // The symbol you want to subscribe to
            orderBy: '{value} ASC' // The sort order is defined as a string containing a path to a property or {value} and the sort order (ASC or DESC). In this case we sort alphabetically in ascending order.
        };

        Server.subscribe<string[]>(
            [subscriptionCommand], // It is possible to subscribe to multiple commands simultaneously, so the command has to be wrapped in an array
            500, // The polling interval of the subscription
            (data) => { // The callback function receives the data from the server as its argument and is called every time the value on the server changes
                const readValue = data.response?.commands?.[0].readValue; // The sorted data

                if (readValue) {
                    textblockSubscription.setText(readValue.join(' '));
                }
            }
        );



        // Sorting a struct by its properties in a readWrite request:

        const readWriteCommand: Server.ICommand = {
            symbol: 'PLC1.MAIN.loremIpsumItems', // The symbol you want to read
            orderBy: 'properties::length DESC, text ASC' // The sort order is defined as a string containing a path to a property or {value} and the sort order (ASC or DESC).
                                                         // Multiple sort criteria can be used by separating them with commas. Here we first sort by length, with the longest strings first,
                                                         // then alphabetically, so strings with the same lenght are sorted in ascending order.
        };

        const readWriteRequest: Server.IMessage = { // The Server.request function takes the complete request as its argument, so the request is defined here
            requestType: 'ReadWrite', // The type of request
            commands: [
                readWriteCommand // The readWrite command that was defined earlier
            ]
        };

        Server.request<LoremIpsumItem[]>(
            readWriteRequest,
            (data) => { // The callback function receives the data from the server as its argument and is called only once
                const readValue = data.response?.commands?.[0].readValue;  // The sorted data

                if (readValue) {
                    textblockReadWrite.setText(readValue.map((item) => item.text).join('\n'));
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