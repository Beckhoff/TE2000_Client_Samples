// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

(function (TcHmi) {

    var DeleteRecipe = function (ctx, recipeReference) {
        if (!recipeReference) {
            // Stop (not abort) with null (binding without a value) or empty string
            ctx.success();
            
            return;    // We are running async so the return value is not used
        }
        TcHmi.Server.RecipeManagement.deleteRecipe(recipeReference, null, function (data) {
            if (!data.error) {
                TcHmi.Log.info('Recipe ' + recipeReference + ' deleted successfull.');
                // Inform the system that we are done
                ctx.success();
                
                return;    // We are running async so the return value is not used
            } else {
                // Inform the system that we are done but had an error
                ctx.error(data.error, {
                    code: data.error,
                    message: TcHmi.Errors[data.error],
                    reason: 'Function: DeleteRecipe, Recipe ' + recipeReference + ' deletion failed',
                    domain: 'Function',
                    errors: (data.details ? [data.details] : undefined)
                });
                return;    // We are running async so the return value is not used
            }
        });
        
        return;    // We are running async so the return value is not used
    };
    
    TcHmi.Functions.registerFunction('DeleteRecipe', DeleteRecipe);
})(TcHmi);