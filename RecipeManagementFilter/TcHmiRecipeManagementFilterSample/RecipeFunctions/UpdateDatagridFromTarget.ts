// This function is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Errors, Functions, Server, type Context, type SelectableRequired } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';
import type { TcHmiDatagrid } from 'Beckhoff.TwinCAT.HMI.Controls/index.esm.js';
import type { RecipeDatagridRow } from './ConvertRecipeToDatagrid.js';

/**
 * Reads the current values of the recipe members from their symbols (the target)
 * and shows them in the column "New value" of the datagrid RecipeDatagrid.
 * @param ctx Context object which provides context specific data and functions.
 * @param datagridControl The datagrid with the rows of ConvertRecipeToDatagrid.
 * @param recipeReference Reference (path + '::' + name) of the recipe.
 */
export function UpdateDatagridFromTarget(
    ctx: SelectableRequired<Context<void>, 'success' | 'error'>,
    datagridControl: TcHmiDatagrid.Control | null,
    recipeReference: string | null
) {
    if (!recipeReference || !datagridControl) {
        ctx.success();
        return;
    }

    Server.RecipeManagement.readFromTarget(recipeReference, null, (data) => {
        if (data.error !== Errors.NONE) {
            ctx.error(data.error, {
                code: data.error,
                message: Errors[data.error],
                reason: 'Values of recipe ' + recipeReference + ' could not be read from the target.',
                domain: 'TcHmi.Functions.RecipeManagementFilterSample.UpdateDatagridFromTarget',
                errors: data.details ? [data.details] : undefined,
            });
            return;
        }
        // The result is a dictionary with the recipe reference as key.
        const targetValues = data.value?.[recipeReference]?.values;
        const rows = datagridControl.getSrcData() as RecipeDatagridRow[] | null;
        if (!targetValues || !Array.isArray(rows)) {
            ctx.error(Errors.E_PARAMETER_INVALID, {
                code: Errors.E_PARAMETER_INVALID,
                message: Errors[Errors.E_PARAMETER_INVALID],
                reason: 'Values of recipe ' + recipeReference + ' have an unexpected format.',
                domain: 'TcHmi.Functions.RecipeManagementFilterSample.UpdateDatagridFromTarget',
            });
            return;
        }

        // New rows with the target values in the column "New value". Members without a target value keep their row.
        datagridControl.setSrcData(
            rows.map((row) =>
                targetValues[row.memberName] === undefined ? row : { ...row, newValue: targetValues[row.memberName] }
            )
        );
        ctx.success();
    });
}

Functions.registerFunctionEx('UpdateDatagridFromTarget', 'TcHmi.Functions.RecipeManagementFilterSample', UpdateDatagridFromTarget);
