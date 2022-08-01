# PagingInControl

This sample demonstrates how to implement a control that requests paged data from the server.

## DataSymbol attribute

To get access to the symbol metadata, the control defines an attribute of the custom type `tchmi:framework#/definitions/TcHmi.Controls.StringPager.StringPagerControl.DataSymbol`. This type is defined as

``` JSON
"TcHmi.Controls.StringPager.StringPagerControl.DataSymbol": {
  "allOf": [
    {
      "$ref": "tchmi:framework#/definitions/Symbol"
    },
    {
      "frameworkSymbolSubType": {
        "$ref": "tchmi:general#/definitions/Array"
      }
    }
  ]
}
```

which means that values for this type should be symbols that contain an array as the underlying data. Typing the attribute this way ensures that the symbol reference is passed directly to the control instead of being resolved, in which case the control would only receive the underlying data.

## Requesting paged data from the server

Data can be paged server-side by manually subscribing to or reading a symbol that contains an array and including paging parameters in the command that is send to the server. The relevant parameters are:

- `offset`: The index of the first item that should be sent to the client
- `limit`: The maximum number of items that should be sent to the client
- `orderBy`: Allows sorting items on the server before they are paged
- `filter`: Provides a way to filter items before they are sorted and paged

A complete command could look like this:

``` TypeScript
const command: Server.ICommand = {
    commandOptions: ['SendErrorMessage'],
    symbol: 'mySymbol',
    offset: 20,
    limit: 10,
    orderBy: '{value} DESC',
    filter: [
        {
            comparator: 'contains',
            value: 'search string'
        }
    ]
};

```

The response will contain the filtered, sorted and paged data, as well as the `maxItems` property which contains the total number of array items that match the filter.

To see this in action take a look at the method `__subscribeToDataSymbol` in [StringPagerControl.ts, line 185](StringPager/StringPagerControl/StringPagerControl.ts#L185).

## Writing paged data to the server

To be able to write data to a symbol that has been read using paging, it is necessary to know the original indices of the array items before they were filtered, sorted and paged. The original indices can be obtained by including the `filterMap` property with an empty array as its value in the read request. The presence of this property signals to the server that it should fill out this map and send it back in the response.

This is best demonstrated with an example. Given this request:

``` TypeScript
const requestCommand: Server.ICommand = {
    commandOptions: ['SendErrorMessage'],
    symbol: 'jumbledAlphabet',
    offset: 5,
    limit: 10,
    orderBy: '{value} ASC',
    filterMap: []
};
```

The response should look like this:

``` Typescript
{
    commandOptions: ['SendErrorMessage'],
    symbol: 'jumbledAlphabet',
    offset: 5,
    limit: 10,
    orderBy: '{value} ASC',
    readValue: ['f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o'],
    filterMap: [19, 16, 22, 2, 8, 1, 23, 12, 7, 3 ],
    maxEntries: 26
}
```

In this case the `filterMap` tells us that `'f'` is at index 19 in the raw data, `'g'` is at index 16 and so on. This knowledge can then be used to replace the `'f'` with `'foo'` by directly writing to that index:

``` TypeScript
TcHmi.Server.writeSymbolEx('jumbledAlphabet[19]', 'foo', null, handleServerResponse);
```

This can be seen in action in the method `__writeToDataSymbol` in [StringPagerControl.ts, line 286](StringPager/StringPagerControl/StringPagerControl.ts#L286).

## Sample PLC

This sample uses symbols that are mapped to variables in the [SampleSymbols PLC](SampleSymbols). If you want to run the sample you should activate that PLC project so the sample has access to the symbol values.
