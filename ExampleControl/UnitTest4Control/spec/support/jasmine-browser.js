import * as express from "express";
import * as fs from "node:fs";
import * as process from "node:process";


// Find the path to the TcHmiFramework package from the tsconfig.json file.
// ********************************
const tsconfig = fs.readFileSync(process.cwd() + '/tsconfig.json', 'utf-8');
/** @type {{ compilerOptions: { paths?: Record<string, string[]> }; files?: string[]; include?: string[]; }} */
const tsconfigObj = JSON.parse(tsconfig);
// string like "../Packages/Beckhoff.TwinCAT.HMI.Framework.14.4.70/runtimes/native1.12-tchmi/*"
const firstFrameworkPath = tsconfigObj?.compilerOptions?.paths?.["Beckhoff.TwinCAT.HMI.Framework/*"]?.at(0);
const frameworkPath = firstFrameworkPath?.replace('../', '').replace('/*', '');
if (!frameworkPath) {
    throw new Error('Could not find path to TcHmiFramework package via tsconfig.json');
}
const controlsPath = tsconfigObj?.compilerOptions?.paths?.["Beckhoff.TwinCAT.HMI.Controls/*"]?.at(0)?.replace('../', '').replace('/*', '');
if (!controlsPath) {
    throw new Error('Could not find path to TcHmiControls package via tsconfig.json');
}

export default {
    // Jasmine-browser decides how to load files (script or es module) based on their file extension
    esmFilenameExtension: '.esm.js',

    srcDir: "../",
    srcFiles: [
        // Basic config to prevent full framework load
        "UnitTest4Control/spec/support/flags.js",
        // Libs of the TcHmiFramework which are loaded as scripts in the browser (not as modules)
        `${frameworkPath}/Lib/jquery.min.js`,
        `${frameworkPath}/Lib/tslib.js`,
        `${frameworkPath}/Lib/acorn.js`,

        // load framework and TcHmiControl as module.
        // This works because it has an matching file extension as defined here in esmFilenameExtension
        `${frameworkPath}/index.esm.js`,

        // Code under test will be imported by the spec files
    ],

    // These files contains the test itself
    specDir: "spec",
    specFiles: [
        // would be loaded as script (not as module) because of the file extension
        // "**/*[sS]pec.js",
        // will be loaded as module because of the file extension (ref config esmFilenameExtension)
        "**/*[sS]pec.esm.js"
    ],

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
    // so we need to provide the package directory via the test webserver
    // under this special url.
    middleware: {
        "/ExampleControl": express.static(
            "../ExampleControl"
        )
    },

    // tell the browser how to load an import via package name (like "Beckhoff.TwinCAT.HMI.Framework/") to a relative path
    importMap: {
        imports: {
            "Beckhoff.TwinCAT.HMI.Framework/": `../${frameworkPath}/`,
            "Beckhoff.TwinCAT.HMI.Controls/": `../${controlsPath}/`,
            "ExampleControl/": "../ExampleControl/",
        }
    },
    modulesWithSideEffectsInSrcFiles: true
};
