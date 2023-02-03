// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Controls.12.758.8/runtimes/native1.12-tchmi/TcHmiDatagrid/TcHmiDatagrid.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    /**
     * @param ctx {TcHmi.Context<void>}
     * @param datagridControl {TcHmi.Controls.Beckhoff.TcHmiDatagrid}
     * @param recipeReference {string}
     */
    var ConvertDatagridToRecipe = function (ctx,datagridControl,recipeReference) {
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
        // Fetches the current datagrid data
        var srcData = datagridControl.getSrcData();
        if (!srcData || !Array.isArray(srcData)) {
            // Inform the system that we are done
            ctx.success();
            
            return;    // We are running async so the return value is not used
        }
        // Build up the dictionary with the correct values
        let newValue = {};
        for (let i = 0; i < srcData.length; i++) {
            if (!srcData[i].memberName) {
                continue;
            }
            newValue[srcData[i].memberName] = srcData[i].newValue;
        }
        // Call server to update recipe
        TcHmi.Server.RecipeManagement.updateRecipe(recipeReference, null, newValue, function (data) {
            if (data.error) {
                // Inform the system that we are done but had an error
                ctx.error(data.error, {
                    code: data.error,
                    message: TcHmi.Errors[data.error],
                    reason: 'Function: ConvertDatagridToRecipe, Recipe ' + recipeReference + ' update failed',
                    domain: 'Function',
                    errors: (data.details ? [data.details] : undefined)
                });
                
                return;    // We are running async so the return value is not used
            } else {
                // Inform the system that we are done
                ctx.success();
                
                return;    // We are running async so the return value is not used
            }
        });
        
        return;    // We are running async so the return value is not used
    };
    
    TcHmi.Functions.registerFunction('ConvertDatagridToRecipe', ConvertDatagridToRecipe);
})(TcHmi);