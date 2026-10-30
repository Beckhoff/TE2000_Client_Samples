// This function is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Errors, Functions, Server, type Context, type SelectableRequired } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';

/** Row of the datagrid RecipeDatagrid. The names must match the columns of the datagrid. */
export interface RecipeDatagridRow {
    /** Name of the recipe member (symbol). */
    memberName: string;
    /** Value which is saved in the recipe. */
    value: any;
    /** New value which is saved by ConvertDatagridToRecipe. */
    newValue: any;
}

/**
 * Reads a recipe from the server and converts its members to rows for the datagrid RecipeDatagrid.
 * @param ctx Context object which provides context specific data and functions.
 * @param recipeReference Reference (path + '::' + name) of the recipe.
 */
export function ConvertRecipeToDatagrid(
    ctx: SelectableRequired<Context<RecipeDatagridRow[] | null>, 'success' | 'error'>,
    recipeReference: string | null
) {
    if (!recipeReference) {
        // No recipe selected: null resets the datagrid to its default.
        ctx.success(null);
        return;
    }

    Server.RecipeManagement.getRecipe(recipeReference, null, (data) => {
        if (data.error !== Errors.NONE) {
            ctx.error(data.error, {
                code: data.error,
                message: Errors[data.error],
                reason: 'Recipe ' + recipeReference + ' could not be read.',
                domain: 'TcHmi.Functions.RecipeManagementFilterSample.ConvertRecipeToDatagrid',
                errors: data.details ? [data.details] : undefined,
            });
            return;
        }
        if (!data.value?.values) {
            ctx.error(Errors.E_PARAMETER_INVALID, {
                code: Errors.E_PARAMETER_INVALID,
                message: Errors[Errors.E_PARAMETER_INVALID],
                reason: 'Recipe ' + recipeReference + ' has no values.',
                domain: 'TcHmi.Functions.RecipeManagementFilterSample.ConvertRecipeToDatagrid',
            });
            return;
        }

        // One row per member. The new value starts with the saved value.
        const rows = Object.entries(data.value.values).map(([memberName, value]) => ({
            memberName,
            value,
            newValue: value,
        }));
        ctx.success(rows);
    });
}

Functions.registerFunctionEx('ConvertRecipeToDatagrid', 'TcHmi.Functions.RecipeManagementFilterSample', ConvertRecipeToDatagrid);
