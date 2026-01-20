const express = require("express");

module.exports = {
    srcDir: "../",
    srcFiles: [
        // Basic config to prevent full framework load
        "UnitTest4Control/spec/support/flags.js",
        // Libs and TcHmiFramework (last non-module based version)
        "Packages/Beckhoff.TwinCAT.HMI.Framework.14.2.110/runtimes/native1.12-tchmi/Lib/jquery.js",
        "Packages/Beckhoff.TwinCAT.HMI.Framework.14.2.110/runtimes/native1.12-tchmi/Lib/acorn.js",
        "Packages/Beckhoff.TwinCAT.HMI.Framework.14.2.110/runtimes/native1.12-tchmi/TcHmiFramework.js",
        "Packages/Beckhoff.TwinCAT.HMI.Framework.14.2.110/runtimes/native1.12-tchmi/Controls/System/TcHmiControl/TcHmiControl.js",

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
    modulesWithSideEffectsInSrcFiles: true,
    esmFilenameExtension: '.esm.js',
};
