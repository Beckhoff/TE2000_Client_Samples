// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

(function (TcHmi) {

    var ConvertRecipeToDataGrid = function (ctx,recipeReference) {
        if (!recipeReference) {
            // Stop (not abort) with null (binding without a value) or empty string
            ctx.success(null);  // setting null, as the setter of the datagrid must be called with the default
            
            return;    // We are running async so the return value is not used
        }

        // Call server to fetch recipe
        TcHmi.Server.RecipeManagement.getRecipe(recipeReference, null, function (data) {
            if (data.error) {
                // Inform the system that we are done but had an error
                ctx.error(data.error, {
                    code: data.error,
                    message: TcHmi.Errors[data.error],
                    reason: 'Function: ConvertRecipeToDataGrid, Recipe ' + recipeReference + ' fetching failed',
                    domain: 'Function',
                    errors: (data.details ? [data.details] : undefined)
                });
                
                return;    // We are running async so the return value is not used
            } else {
                // Check if the format of the recipe is known
                if (!data.value || !data.value.values) {
                    // Inform the system that we are done but had an error
                    ctx.error(TcHmi.Errors.E_PARAMETER_INVALID, {
                        code: TcHmi.Errors.E_PARAMETER_INVALID,
                        message: TcHmi.Errors[TcHmi.Errors.E_PARAMETER_INVALID],
                        reason: 'Function: ConvertRecipeToDataGrid, Recipe ' + recipeReference + ' had wrong data format',
                        domain: 'Function'
                    });
                    
                    return;    // We are running async so the return value is not used
                }
                // Build up an array for the datagrid data (must match the SrcColumn of the datagrid)
                var result = [];
                for (var memberName in data.value.values) {
                    result.push({
                        memberName: memberName,
                        value: data.value.values[memberName],
                        newValue: data.value.values[memberName]
                    });
                }
                // Inform the system that we are done and have a result
                ctx.success(result);
                
                return;    // We are running async so the return value is not used
            }
        });
        
        return;    // We are running async so the return value is not used
    };
    
    TcHmi.Functions.registerFunction('ConvertRecipeToDataGrid', ConvertRecipeToDataGrid);
})(TcHmi);