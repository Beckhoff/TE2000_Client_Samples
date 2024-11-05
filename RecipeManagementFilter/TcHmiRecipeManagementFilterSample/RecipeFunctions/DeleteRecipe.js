// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {
    /**
     * @param ctx {TcHmi.Context<void>}
     * @param recipeReference {string}
     */
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