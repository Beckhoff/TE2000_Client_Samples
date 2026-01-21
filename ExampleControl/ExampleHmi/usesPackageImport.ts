// This file demonstrates importing a number from an ES module in a package with its package identifier.
// See tsconfig.json for TS path mapping. Browser mapping is done automatically.
import { randomNumber } from "ExampleControlEsModule/ControlWithImport/someNumbers.js"; 

TcHmi.Log.infoEx('imported number: %o', randomNumber);
