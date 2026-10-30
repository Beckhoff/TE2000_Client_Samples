# UglifyJsDuringBuild

This sample shows how to minify (uglify) the JavaScript files of a package project after each build with [Terser](https://www.npmjs.com/package/terser) and an npm script.

## Running the sample

1. Open [FrameworkPrj1.sln](FrameworkPrj1/FrameworkPrj1.sln) in Visual Studio or the TwinCAT XAE Shell with TwinCAT HMI Engineering installed. Node.js is supplied together with TwinCAT HMI, a manual installation is not necessary.
2. Restore the NuGet packages and build the solution. After the build, the post-build event installs Terser with npm and runs the npm script `uglify`. The first build needs access to the npm registry to download Terser.
3. Open `FrameworkPrj1Control/FrameworkPrj1Control.js` in the project folder: it contains the minified JavaScript of [FrameworkPrj1Control.ts](FrameworkPrj1/FrameworkPrj1/FrameworkPrj1Control/FrameworkPrj1Control.ts).

## Overview

The solution contains one project:

| Project                                      | Content                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| [FrameworkPrj1](FrameworkPrj1/FrameworkPrj1) | A package project with the control `FrameworkPrj1Control` and the npm configuration. |

The project has no HMI, the sample is about the build of the package.

## How it works

### 1. Call Terser with an npm script

[package.json](FrameworkPrj1/FrameworkPrj1/package.json) defines Terser as npm package and the npm script `uglify`, which calls it. `npm install` in the folder of the file downloads Terser to `node_modules`, `npm run uglify` runs the script:

```json
{
  "private": true,
  "scripts": {
    "uglify": "terser FrameworkPrj1Control/FrameworkPrj1Control.js --compress --mangle --output FrameworkPrj1Control/FrameworkPrj1Control.js"
  },
  "devDependencies": {
    "terser": "5.51.2"
  }
}
```

Terser overwrites the compiled JavaScript file with its minified version. `--compress` simplifies the code and `--mangle` shortens the names of local variables. Without these options, Terser only removes whitespace and comments.

To minify more files, add one Terser call per file and join the calls with `&&`. With several input files and one `--output`, Terser combines all files into one.

The source map `FrameworkPrj1Control.js.map`, which TypeScript creates, does not match the minified file anymore. The package does not contain it, see step 3.

### 2. Run the script after the build

The tab `Build Events` of the project properties (right-click on the project, Properties) defines command line scripts which run before or after the build. The post-build event of this sample installs the npm packages and runs the npm script:

```bat
@echo off
call npm install
call npm run uglify
```

The sample defines this event for both build configurations, `Debug` and `Release`. Minified code is hard to debug in the browser. To minify only the release build, remove the event from the configuration `Debug`.

### 3. Keep the development files out of the NuGet package

`node_modules` is only needed for the build. [FrameworkPrj1.nuspec](FrameworkPrj1/FrameworkPrj1/FrameworkPrj1.nuspec) excludes it from the files of the package:

```xml
<file
	src="**/*.js"
	target="runtimes\native1.12-tchmi\"
	exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
```

The source files for debugging, `*.ts` and `*.js.map`, are commented out in the `.nuspec`, so the package contains only the minified JavaScript. Because the `**/*.ts` rule is commented out, a separate rule adds the `*.d.ts` files:

```xml
<file
	src="**/*.d.ts"
	target="runtimes\native1.12-tchmi\"
	exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
```

## Further information

- [Terser command line usage](https://www.npmjs.com/package/terser#command-line-usage) (npm)
- [npm run](https://docs.npmjs.com/cli/commands/npm-run-script) (npm documentation)
