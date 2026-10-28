// This code-behind file implements the TypeScript/JavaScript variant for the control TypeScriptLamp in Pages/TypeScript.content.
// It is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Controls, Errors, EventProvider, Log, Symbol, type DestroyFunction } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';
import type { TcHmiEllipse } from 'Beckhoff.TwinCAT.HMI.Controls/index.esm.js';

/** Symbol expression of the server symbol the lamp reacts on. */
const MACHINE_RUNNING = '%s%MachineRunning%/s%';

const GREEN = { color: 'rgba(46, 160, 67, 1)' };
const RED = { color: 'rgba(215, 58, 73, 1)' };

/** Removes the symbol watch. Only set while TypeScriptLamp is attached. */
let destroyWatch: DestroyFunction | null = null;

// The watch is created when the control is attached to the DOM and removed when it is detached,
// so the server subscription exists exactly as long as the control, like a trigger defined in the content.
EventProvider.register('TypeScriptLamp.onAttached', () => {
    const lamp = Controls.get<TcHmiEllipse.Control>('TypeScriptLamp');
    if (!lamp) {
        return;
    }

    // One subscription. The callback receives the new value with every change, so no further read is needed.
    // The fill color is set directly via the setter, so no symbol expression has to be resolved for the write.
    const machineRunning = new Symbol<boolean>(MACHINE_RUNNING);
    const destroyMachineRunningWatch = machineRunning.watch((data) => {
        if (data.error !== Errors.NONE) {
            Log.errorEx('SymbolChangeTrigger: Watching %s failed: %s', MACHINE_RUNNING, Log.buildMessage(data.details));
            return;
        }
        lamp.setFillColor(data.value ? GREEN : RED);
    });

    destroyWatch = () => {
        destroyMachineRunningWatch();
        machineRunning.destroy();
    };
});

EventProvider.register('TypeScriptLamp.onDetached', () => {
    destroyWatch?.();
    destroyWatch = null;
});
