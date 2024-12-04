# Uglify JavaScript in a Framework Project

This sample shows how to uglify JavaScript files during build with help of [Node.js](https://nodejs.org/en/) , [Grunt Task-Runner](https://www.npmjs.com/package/grunt) and [Terser](https://www.npmjs.com/package/terser).

## Setup Node.js, Grunt, Terser

Node.js is supplied together with TwinCAT HMI and manual installation is therefore not necessary.

If you need a newer version for whatever reason, you can download it from [here](https://nodejs.org/en/).

### package.json

We have to create a package.json file with at least the following configuration to be able to fetch the required npm (Node Package Manager) packages.

````json
{
  "private": true,
  "devDependencies": {
    "grunt": "1.0.4",
    "grunt-cli": "1.3.2",
    "grunt-terser": "2.0.0",
    "terser": "5.14.2",
  }
}
````

If we call `npm install` within the directory where the package.json is stored the defined dependencies will be downloaded to `node_modules` by npm.

### Gruntfile.js

We have to create a [Gruntfile.js](https://gruntjs.com/getting-started#the-gruntfile) for configuration of our [Terser](https://www.npmjs.com/package/terser) [Grunt](https://www.npmjs.com/package/grunt) task.

````js
/**
 * 
 * @param {IGrunt} grunt Grunt object 
 */
module.exports = function (grunt) {
    // Grunt build configuration.
    grunt.initConfig({
        // General
        pkg: grunt.file.readJSON('package.json'),
        // Task: 'terser'
        terser: {
            release: {
                options: {
                    output: {
                        beautify: false,
                    }
                },
                files: {
                    'FrameworkPrj1Control/FrameworkPrj1Control.js': ['FrameworkPrj1Control/FrameworkPrj1Control.js'],
                }
            }
        }
    });

    // Load npm tasks 
    grunt.loadNpmTasks('/grunt-terser');

    // Register grunt tasks
    grunt.registerTask('Uglify', [
        'terser:release',
    ]);
};
````

### Hint
#### Avoid unwanted files in nuget packages

We add the exclude rules `Gruntfile.js;node_modules\**;` and `node_modules\**;` to the related file filter definitions in the FrameworkPrj1.nuspec file because those files are only relevant in the development environment.

The following file filter rules have to be commented out to avoid debugging related source files in the resulting NuGet package.

````xml
<!-- Add the following commented out parts to add debugging related source files to the package. -->
<!--
<file
	src="**/*.js.map"
	target="runtimes\native1.12-tchmi\"
	exclude=".hmipkgs\**;node_modules\**;.hmiframework\**"
/>
<file
	src="**/*.ts"
	target="runtimes\native1.12-tchmi\"
	exclude=".hmipkgs\**;node_modules\**;.hmiframework\**"
/>
-->
````

The following file filter rule has to be added when `src="**/*.ts"` is commented out to make sure `*.d.ts` files are still included.

````xml
<file
	src="**/*.d.ts"
	target="runtimes\native1.12-tchmi\"
	exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"
/>
````

FrameworkPrj1.nuspec

````xml
<?xml version="1.0"?>
<package xmlns="">
	<metadata>
		<id>FrameworkPrj1</id>
		<version>1.0.0</version>
		<description>-.-</description>
		<authors>AUTHOR_HERE</authors>
		<title>FrameworkPrj1</title>
		<owners>OWNER_HERE</owners>
		<projectUrl>http://PROJECT_URL_HERE_OR_DELETE_THIS_LINE</projectUrl>
		<requireLicenseAcceptance>false</requireLicenseAcceptance>
		<releaseNotes>Summary of changes made in this release of the package.</releaseNotes>
		<copyright>Copyright 2024</copyright>
		<tags>TwinCAT HMI</tags>
		<dependencies>
			<group targetFramework="native1.12-tchmi">
				<dependency id="Beckhoff.TwinCAT.HMI.Framework" version="14.2.110" />
			</group>
		</dependencies>
	</metadata>
	<files>
		<!-- Add additional files here to include them in the nuget package -->
		<file src="images\logo.png" target="images\" />
		<file
			src="Manifest.json"
			target="runtimes\native1.12-tchmi\"
			exclude=""/>
		<file
			src="**/*.function.json"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/Description.json"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/Types.Schema.json"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/*.html"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/*.css"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/*.png"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/*.svg"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/*.jpg"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/*.ico"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/*.theme"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<file
			src="**/*.js"
			target="runtimes\native1.12-tchmi\"
			exclude="Gruntfile.js;node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<!-- Make sure '**/*.d.ts' files are added to the package regardless of the '**/*.ts' filter. -->
		<file
			src="**/*.d.ts"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"/>
		<!-- Add the following commented out parts to add debugging related source files to the package. -->
		<!--
		<file
			src="**/*.js.map"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"
		/>
		<file
			src="**/*.ts"
			target="runtimes\native1.12-tchmi\"
			exclude="node_modules\**;.hmipkgs\**;.hmiframework\**"
		/>
		-->
	</files>
</package>
````

## Run Terser Grunt Task on build

On the Properties-Page (Right click on the project node -> Properties) of the TwinCAT HMI Framework Project you have the possibility to define build event command line scripts.

* Pre-build event command line scripts will be processed before the build starts.
* Post-build event command line scripts will be processed after the build has finished.

![Framework-Project-Build-Events](README/Framework-Project-Build-Events-1.png)

To uglify our JavaScript files on each Release build we define the following script in the Post-build event command line area.

````bat
@echo off
call npm install
call  "$(ProjectDir)node_modules\.bin\grunt" Uglify --no-color
````

The script will call `npm install` to make sure all all required node modules do exist and then it will call grunt within the local node_modules directory with the name of our defined grunt task. Grunt will now process this task and the task will process the terser job based on the terser:release configuration we made in Gruntfile.js.

All we have to do now is to select the Release build configuration and build the project.

![Framework-Project-Build](README/Framework-Project-Build-1.png)
