// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Controls.12.758.8/runtimes/native1.12-tchmi/TcHmiDatagrid/TcHmiDatagrid.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {

    /**
     * @param ctx {TcHmi.Context<void>}
     * @param datagridControl {TcHmi.Controls.Beckhoff.TcHmiDatagrid}
     * @param recipeReference {string}
     */
    var UpdateDatagridFromTarget = function (ctx,datagridControl,recipeReference) {
        if (!recipeReference) {
            // Stop (not abort) with null (binding without a value) or empty string
            ctx.success();
            return;    // We are running async so the return value is not used
        }
        if (!datagridControl) {
            // Stop (not abort) with null (binding without a value)
            ctx.success();
            return;    // We are running async so the return value is not used
        }
        TcHmi.Server.RecipeManagement.readFromTarget(recipeReference, null, function (data) {
            if (data.error) {
                // Inform the system that we are done but had an error
                ctx.error(data.error, {
                    code: data.error,
                    message: TcHmi.Errors[data.error],
                    reason: 'Function: UpdateDatagridFromTarget, Recipe ' + recipeReference + ' readFromTarget failed',
                    domain: 'Function',
                    errors: (data.details ? [data.details] : undefined)
                });
                return;    // We are running async so the return value is not used
            } else {
                var srcData = tchmi_clone_object(datagridControl.getSrcData());
                if (!srcData || !Array.isArray(srcData)) {
                    // Inform the system that we are done
                    ctx.success();
                    return;    // We are running async so the return value is not used
                }

                if (!data.value || !data.value) {
                    // Inform the system that we are done but had an error
                    ctx.error(TcHmi.Errors.E_PARAMETER_INVALID, {
                        code: TcHmi.Errors.E_PARAMETER_INVALID,
                        message: TcHmi.Errors[TcHmi.Errors.E_PARAMETER_INVALID],
                        reason: 'Function: UpdateDatagridFromTarget, Recipe ' + recipeReference + ' readFromTarget had wrong format',
                        domain: 'Function'
                    });
                    return;    // We are running async so the return value is not used
                }
                let recipe = data.value[recipeReference];

                // Update the array for the datagrid data (must match the SrcColumn of the datagrid)
                for (let i = 0; i < srcData.length; i++) {
                    if (!srcData[i].memberName) {
                        continue;
                    }
                    if (recipe.values[srcData[i].memberName] === undefined) {
                        // The current PLC data has no value for this. hu?
                        continue;
                    }
                    
                    srcData[i].newValue = recipe.values[srcData[i].memberName];
                }
                datagridControl.setSrcData(srcData);
                // Inform the system that we are done
                ctx.success();
                
                return;    // We are running async so the return value is not used
            }
        });
        
        return;    // We are running async so the return value is not used
    };
    
    TcHmi.Functions.registerFunction('UpdateDatagridFromTarget', UpdateDatagridFromTarget);
})(TcHmi);