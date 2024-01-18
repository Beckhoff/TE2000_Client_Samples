const express = require("express");

module.exports = {
  srcDir: "../",
  srcFiles: [
    // Basic config to prevent full framework load
    "ControlTest/spec/support/flags.js",
    // Libs and TcHmiFramework
    // loaded from the ExampleControl directory
    // to reduce the need to keep the packages in ControlTest up to date
    "ExampleControl/.hmiframework/Lib/jquery.js",
    "ExampleControl/.hmiframework/Lib/acorn.js",
    "ExampleControl/.hmiframework/TcHmiFramework.js",
    "ExampleControl/.hmiframework/Controls/System/TcHmiControl/TcHmiControl.js",

    // Code of Control to test
    "ExampleControl/ColorChange/ColorChange.js",
  ],

  // This files contains the test itself
  specDir: "spec",
  specFiles: ["**/*[sS]pec.js"],

  // Contains code to instantiate controls.
  helpers: ["helpers/**/*.js"],
  env: {
    stopSpecOnExpectationFailure: false,
    stopOnSpecFailure: false,
    random: false,
  },
  browser: {
    name: "chrome",
  },

  // The spec wants to load Template.html 
  // (in mockupHelper.ts function GenerateTemplateElement())
  // so we need to provide the directory via the test webserver
  // under this special url.
  middleware: {
    "/TcHmi.Controls.ExampleControl.ColorChange": express.static(
      "../ExampleControl/ColorChange"
    ),
  },
};
