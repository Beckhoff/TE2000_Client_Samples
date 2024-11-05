# Control unit tests

This project is an example to create unit tests for a frameowrk control. The tests are working on the `ColorChange` control in the `ExampleControl` Visual Studio project.

## Preparation

All needed software is delivered via NPM packages. To download and install these you need to call once

```cmd
npm install
```

in the same directory with the `packages.json` file.

## Running tests in local browser

After that you need to start the test webserver by running the following command:

```cmd
npx jasmine-browser-runner serve
```

This produces an output which shows an url like this:

> Jasmine server is running here: http://localhost:8888

This is the url you need to open with your chrome or firefox.

## Explanation of infrastructure

- [spec/support/jasmine-browser.js](spec/support/jasmine-browser.js) has the config for the test runner. See comments for more information.
- [spec/support/flags.js](spec/support/flags.js) disables Framework initialisation and Framework logging.
- [helpers/mockupHelper.js](helpers/mockupHelper.js) contains code to instantiate controls outside the running framework environment.

The framework control project itself has the code under test:

- [../ExampleControl/ColorChange/ColorChange.ts](../ExampleControl/ColorChange/ColorChange.ts) contains the control test itself.
