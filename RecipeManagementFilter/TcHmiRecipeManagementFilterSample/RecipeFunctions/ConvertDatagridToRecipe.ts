// This function is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Errors, Functions, Server, type Context, type Dictionary, type SelectableRequired } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';
import type { TcHmiDatagrid } from 'Beckhoff.TwinCAT.HMI.Controls/index.esm.js';
import type { RecipeDatagridRow } from './ConvertRecipeToDatagrid.js';

/**
 * Saves the new values of the datagrid RecipeDatagrid in a recipe.
 * @param ctx Context object which provides context specific data and functions.
 * @param datagridControl The datagrid with the rows of ConvertRecipeToDatagrid.
 * @param recipeReference Reference (path + '::' + name) of the recipe.
 */
export function ConvertDatagridToRecipe(
    ctx: SelectableRequired<Context<void>, 'success' | 'error'>,
    datagridControl: TcHmiDatagrid.Control | null,
    recipeReference: string | null
) {
    const rows = datagridControl?.getSrcData() as RecipeDatagridRow[] | null | undefined;
    if (!recipeReference || !Array.isArray(rows)) {
        // Nothing to save.
        ctx.success();
        return;
    }

    // The server expects the new values as a dictionary of member names and values.
    const newValues: Dictionary<any> = {};
    for (const row of rows) {
        if (row.memberName) {
            newValues[row.memberName] = row.newValue;
        }
    }

    Server.RecipeManagement.updateRecipe(recipeReference, null, newValues, (data) => {
        if (data.error !== Errors.NONE) {
            ctx.error(data.error, {
                code: data.error,
                message: Errors[data.error],
                reason: 'Recipe ' + recipeReference + ' could not be updated.',
                domain: 'TcHmi.Functions.RecipeManagementFilterSample.ConvertDatagridToRecipe',
                errors: data.details ? [data.details] : undefined,
            });
            return;
        }
        ctx.success();
    });
}

Functions.registerFunctionEx('ConvertDatagridToRecipe', 'TcHmi.Functions.RecipeManagementFilterSample', ConvertDatagridToRecipe);
