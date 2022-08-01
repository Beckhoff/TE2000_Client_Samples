module TcHmi {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    var destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', function (e, data) {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();

        const textblockValueFilter = Controls.get<Controls.Beckhoff.TcHmiTextbox>('TextblockValueFilter');
        const textblockPropertyFilter = Controls.get<Controls.Beckhoff.TcHmiTextbox>('TextblockPropertyFilter');
        const textblockComplexFilter = Controls.get<Controls.Beckhoff.TcHmiTextbox>('TextblockComplexFilter');
        const textblockComplexStringFilter = Controls.get<Controls.Beckhoff.TcHmiTextbox>('TextblockComplexStringFilter');

        if (!textblockValueFilter || !textblockPropertyFilter || !textblockComplexFilter || !textblockComplexStringFilter) {
            return;
        }

        // Filtering a string by value with JSON object syntax in a subscription:

        const valueFilterCommand: Server.ICommand = {
            symbol: 'PLC1.MAIN.loremIpsum', // The symbol you want to subscribe to
            filter: [ // The filter can be specified in JSON object syntax or string syntax. This is JSON object syntax, the equivalent string syntax would be '{value} < "k"'.
                {
                    path: '{value}', // The path specifies which field to filter by. In this case the array to be filtered contains values of a primitive type, so {value} is used to refer to the value itself.
                    comparator: 'contains', // How to compare the value in the array and the reference value
                    value: 'em'       // The reference value
                }
            ]
        };

        Server.subscribe<string[]>(
            [valueFilterCommand], // It is possible to subscribe to multiple commands simultaneously, so the command has to be wrapped in an array
            500, // The polling interval of the subscription
            (data) => { // The callback function receives the data from the server as its argument and is called every time the value on the server changes
                const readValue = data.response?.commands?.[0].readValue; // The filtered data

                if (readValue) {
                    textblockValueFilter.setText(readValue.join('\n'));
                }
            }
        );



        // Filtering a struct by its properties with string syntax in a readWrite request:

        const propertyFilterCommand: Server.ICommand = {
            symbol: 'PLC1.MAIN.loremIpsumItems', // The symbol you want to read
            filter: 'properties::hasUppercase == true' // String syntax filter that matches all items where the hasUppercase field of the properties struct has the boolean value true
        };

        const readWriteRequest: Server.IMessage = { // The Server.request function takes the complete request as its argument, so the request is defined here
            requestType: 'ReadWrite', // The type of request
            commands: [
                propertyFilterCommand // The readWrite command that was defined earlier
            ]
        };

        Server.request<LoremIpsumItem[]>(
            readWriteRequest,
            (data) => { // The callback function receives the data from the server as its argument and is called only once
                const readValue = data.response?.commands?.[0].readValue;  // The filtered data

                if (readValue) {
                    textblockPropertyFilter.setText(readValue.map((item) => item.text).join('\n'));
                }
            }
        );



        // Combining multiple filter criteria

        const complexFilterCommand: Server.ICommand = {
            symbol: 'PLC1.MAIN.loremIpsumItems',
            filter: [
                {
                    path: 'properties::hasUppercase',
                    comparator: '==',
                    value: true
                },
                {
                    logic: 'OR' // Filters can be combined with 'OR' or 'AND' logic
                },
                [ // Filters can be nested to indicate precedence. Nested filters will be evaluated first.
                    {
                        path: 'properties::chars[1]',
                        comparator: '==',
                        value: 'o'
                    },
                    {
                        logic: 'AND'
                    },
                    {
                        path: 'properties::length',
                        comparator: '>=',
                        value: 6
                    }
                ]
            ]
        };

        Server.subscribe<LoremIpsumItem[]>(
            [complexFilterCommand], // It is possible to subscribe to multiple commands simultaneously, so the command has to be wrapped in an array
            500, // The polling interval of the subscription
            (data) => { // The callback function receives the data from the server as its argument and is called every time the value on the server changes
                const readValue = data.response?.commands?.[0].readValue; // The filtered data

                if (readValue) {
                    textblockComplexFilter.setText(readValue.map((item) => item.text).join('\n'));
                }
            }
        );



        // Combining multiple filter criteria with string syntax

        const complexStringFilterCommand: Server.ICommand = {
            symbol: 'PLC1.MAIN.loremIpsumItems',
            filter: 'properties::hasUppercase == true || (properties::chars[1] == "o" && properties::length >= 6)' // This is the same filter as above, but in string syntax
        };

        Server.subscribe<LoremIpsumItem[]>(
            [complexStringFilterCommand], // It is possible to subscribe to multiple commands simultaneously, so the command has to be wrapped in an array
            500, // The polling interval of the subscription
            (data) => { // The callback function receives the data from the server as its argument and is called every time the value on the server changes
                const readValue = data.response?.commands?.[0].readValue; // The filtered data

                if (readValue) {
                    textblockComplexStringFilter.setText(readValue.map((item) => item.text).join('\n'));
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