// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

(function (TcHmi) {

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