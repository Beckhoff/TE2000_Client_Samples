# Control unit tests

This project is an example to create unit tests for a framework control. The tests are working on the `ColorChange` control in the `ExampleControls` Visual Studio project.

## Preparation

All needed software is delivered via NPM packages. To download and install these you need to call once

```cmd
npm install
```

in the same directory as the `package.json` file.

Until then, the Visual Studio build of this project fails, because the TypeScript type definitions of Jasmine (`"types": ["jasmine"]` in `tsconfig.json`) are missing (`error TS2688: Cannot find type definition file for 'jasmine'`).

## Running tests in local browser

After that you need to start the test webserver by running the following command:

```cmd
npx jasmine-browser-runner serve
```

[startTest.bat](startTest.bat) runs the same command.

This produces an output which shows an url like this:

> Jasmine server is running here: http://localhost:8888

This is the url you need to open with your chrome or firefox.

## Explanation of infrastructure

- [spec/support/jasmine-browser.js](spec/support/jasmine-browser.js) has the config for the test runner. See comments for more information.
- [spec/support/flags.js](spec/support/flags.js) disables Framework initialisation and Framework logging.
- [spec/helpers/mockupHelper.ts](spec/helpers/mockupHelper.ts) contains code to instantiate controls outside the running framework environment.

The framework control project itself has the code under test:

- [../ExampleControls/ColorChange/ColorChange.ts](../ExampleControls/ColorChange/ColorChange.ts) contains the control under test.
