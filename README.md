# TwinCAT HMI Client Samples

This repository contains samples for TwinCAT HMI.

> **Note:** The samples are designed for the latest version of TwinCAT HMI. Other branches hold samples for older versions.

## Samples

| Sample                                           | Description                                                                                                                         |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| [ExampleControls](ExampleControls)               | This sample shows how to create controls.                                                                                           |
| [SymbolChangeTrigger](SymbolChangeTrigger)       | This sample shows how a trigger should react to the change of a server symbol without additional server requests.                   |
| [ObjectResolver](ObjectResolver)                 | This sample shows how to use the ObjectResolver class in the context of a control attribute.                                        |
| [AuditTrailReporting](AuditTrailReporting)       | This sample demonstrates how to configure the TcHmiReporting extension in combination with the TcHmiAuditTrail extension.           |
| [PagingInControl](PagingInControl)               | This sample demonstrates how to implement a control that requests paged data from the server and can also write modified data back. |
| [RecipeManagement](RecipeManagement)             | This sample shows how to use the RecipeManagement Framework API.                                                                    |
| [RecipeManagementFilter](RecipeManagementFilter) | This sample shows how to use the RecipeManagement Framework API with added filter functionality.                                    |
| [Reporting](Reporting)                           | This sample demonstrates how to configure the content of a generic report with TcHmiReporting.                                      |
| [SwipeContentOfRegion](SwipeContentOfRegion)     | This sample shows how to create animated content switching in a region which reacts to touch swipe gestures.                        |
| [SymbolPaging](SymbolPaging)                     | This sample demonstrates the basics of server-side symbol paging, filtering and sorting via code-behind files.                      |
| [SystemEngineering](SystemEngineering)           | This sample demonstrates how to use the TcHmiParametersAndFunctions control.                                                        |
| [UglifyJsDuringBuild](UglifyJsDuringBuild)       | This sample shows how to uglify JavaScript in a framework project.                                                                  |
| [UserGuidance](UserGuidance)                     | This sample uses the UserGuidance to explain errors via the EventGrid and to create new recipes.                                    |

## Running a sample

1. Open the solution (`.sln`) in the folder of the sample in Visual Studio or the TwinCAT XAE Shell.
2. Samples with a PLC: activate the configuration of the TwinCAT project in the solution and start the PLC.
3. Restore the NuGet packages, build the solution and start the Live-View of the HMI project.

The README of each sample describes its steps and prerequisites in detail.

## Requirements

- [TE2000 TwinCAT 3 HMI Engineering](https://www.beckhoff.com/en-en/products/automation/twincat/texxxx-twincat-3-engineering/te2000.html) version 1.14 or higher, in Visual Studio or the TwinCAT XAE Shell. Install it with the [TwinCAT Package Manager](https://www.beckhoff.com/de-de/support/downloadfinder/suchergebnis/?download_group=725136885), for example on the command line:

  ```cmd
  tcpkg install TE2000.HMIEngineering.XAE
  ```

- The TwinCAT HMI NuGet packages of the samples. Packages installed with the [TwinCAT Package Manager](https://www.beckhoff.com/de-de/support/downloadfinder/suchergebnis/?download_group=725136885) are used from there, all other packages are restored from [nuget.org](https://www.nuget.org/profiles/Beckhoff).
- A TwinCAT 3 runtime for the samples with a PLC.

## License

The samples are licensed under the Zero-Clause BSD license, see [LICENSE](LICENSE).
