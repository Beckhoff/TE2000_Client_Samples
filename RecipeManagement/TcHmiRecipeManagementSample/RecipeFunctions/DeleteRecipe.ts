// This function is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Errors, Functions, Log, Server, type Context, type SelectableRequired } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';

/**
 * Deletes a recipe.
 * @param ctx Context object which provides context specific data and functions.
 * @param recipeReference Reference (path + '::' + name) of the recipe.
 */
export function DeleteRecipe(ctx: SelectableRequired<Context<void>, 'success' | 'error'>, recipeReference: string | null) {
    if (!recipeReference) {
        ctx.success();
        return;
    }

    Server.RecipeManagement.deleteRecipe(recipeReference, null, (data) => {
        if (data.error !== Errors.NONE) {
            ctx.error(data.error, {
                code: data.error,
                message: Errors[data.error],
                reason: 'Recipe ' + recipeReference + ' could not be deleted.',
                domain: 'TcHmi.Functions.RecipeManagementSample.DeleteRecipe',
                errors: data.details ? [data.details] : undefined,
            });
            return;
        }
        Log.info('[Source=Function, Module=TcHmi.Functions.RecipeManagementSample.DeleteRecipe] Recipe ' + recipeReference + ' deleted.');
        ctx.success();
    });
}

Functions.registerFunctionEx('DeleteRecipe', 'TcHmi.Functions.RecipeManagementSample', DeleteRecipe);
