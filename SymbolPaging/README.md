# SymbolPaging

This sample consists of a collection of CodeBehind files that demonstrates how to filter, sort and page data on the server.

## CodeBehindFiltering

This file demonstrates the basics of filtering data on the server by requesting filtered data and writing the filtered data into a textblock. Any server symbol that returns an array can be filtered.

### Requesting filtered data

To request filtered data, a command must be sent to the server that contains the `orderBy` property.

`filter` contains either a JSON object or a string which defines which array items are returned. This is done by defining a path to the property by which to filter, a comparator and a static value to compare against. Arrays can be filtered by the value of their items if they contain primitive data types like strings, numbers, or booleans by defining `'{value}'` as the path.

Valid comparators are:

- `'=='` for strings, numbers and booleans
- `'!='` for strings, numbers and booleans
- `'<'` for numbers
- `'>'` for numbers
- `'<='` for numbers
- `'>='` for numbers
- `'contains'` for strings and arrays
- `'contains not'` for strings and arrays
- `'== [ignore case]'` for strings
- `'!= [ignore case]'` for strings
- `'contains [ignore case]'` for strings
- `'contains not [ignore case]'` for strings

Filters can be combined with `and` or `or` logic and can be nested to indicate precedence. Nested filters will be evaluated first.

### Example

To see this in action please take a look at the [CodeBehindFiltering.ts file](SymbolPaging/CodeBehindFiltering.ts). This file contains examples for subscribing to and reading from a symbol using different filters. Remember to activate the SampleSymbols PLC to have access to the symbols used in the example.

## CodeBehindSorting

This file demonstrates the basics of sorting data on the server by requesting sorted data and writing the sorted data into a textblock. Any server symbol that returns an array can be sorted.

### Requesting sorted data

To request sorted data, a command must be sent to the server that contains the `orderBy` property.

`orderBy` defines the criteria by which to sort and in which direction. This is done by defining a path to the property by which to sort and `'ASC'` or `'DESC'` for ascending or descending order. Arrays can be sorted by the value of their items if they contain primitive data types like strings, numbers, or booleans by defining `'{value}'` as the path.

For example to sort an array of numbers in ascending order (lowest first), use an `orderBy` value of `'{value} ASC'`. To access struct fields simply specify the fields name: `'myField DESC'`. To access nested structs use `'myField::nestedValue ASC'` and to access array items use `'myArray[2] DESC'`.

### Example

To see this in action please take a look at the [CodeBehindSorting.ts file](SymbolPaging/CodeBehindSorting.ts). This file contains an example for subscribing to a symbol using sorting and reading from a symbol using sorting. Remember to activate the SampleSymbols PLC to have access to the symbols used in the example.

## CodeBehindPaging

This file demonstrates the basics of paging a server symbol by requesting paged data and writing the paged data into a textblock. Any server symbol that returns an array can be paged.

### Requesting paged data

To request paged data, a command must be sent to the server that contains one or both of the properties `offset` and `limit`.

`offset` defines the index of the first item that should be returned. For example an `offset` of 5 would lead to the first 5 items with indices 0-4 to be skipped while the 6th item with index 5 would be returned to the client.

`limit` simply defines how many items should be returned.

### The server response

The server will send back the command, with its `readValue` containing the paged data. The command will also contain the property `maxEntries`, which specifies how many items the array holds in total. This can be used to calculate and display the number of pages.

### Example

To see this in action please take a look at the [CodeBehindPaging.ts file](SymbolPaging/CodeBehindPaging.ts). This file contains an example for subscribing to a symbol using paging and reading from a symbol using paging. Remember to activate the SampleSymbols PLC to have access to the symbols used in the example.

## CodeBehindCombined

This file demonstrates how to combine filtering, sorting and paging in one request.

### Requesting data

To request filtered, sorted and paged data, include the properties `offset`, `limit`, `orderBy` and `filter` in the request to the server.

### Example

To see this in action please take a look at the [CodeBehindCombined.ts file](SymbolPaging/CodeBehindCombined.ts). This file contains an example for subscribing to a symbol using filtering, sorting and paging. Remember to activate the SampleSymbols PLC to have access to the symbols used in the example.

## Sample PLC

The samples use symbols that are mapped to variables in the [SampleSymbols PLC](SampleSymbols). If you want to run the samples you should activate that PLC project so the samples have access to the symbol values.
