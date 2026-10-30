// This function is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Functions, type Server } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';

/**
 * Converts the recipe list of the recipe management (Config::recipeList) to a flat array of recipe references.
 * A reference is the path of the recipe and its name, separated by '::', for example 'SubFolder1::Recipe4'.
 * @param recipeList Recipe list with recipes and folders of recipes.
 */
export function ListRecipesAsReferenceArray(recipeList: Server.RecipeManagement.FolderRecipe | null): string[] {
    const result: string[] = [];
    if (!recipeList) {
        return result;
    }

    // Walks recursively through all folders and remembers the recipes.
    const iterateRecipes = (currentPath: string, recipeFolder: Server.RecipeManagement.FolderRecipe) => {
        for (const [name, recipeOrFolder] of Object.entries(recipeFolder)) {
            const reference = currentPath ? currentPath + '::' + name : name;
            if (
                typeof recipeOrFolder.recipeTypeName === 'string' &&
                recipeOrFolder.values !== null &&
                typeof recipeOrFolder.values === 'object'
            ) {
                // A recipe contains a recipeTypeName and a values object.
                result.push(reference);
            } else {
                // No recipe, so this is a folder: go deeper.
                iterateRecipes(reference, recipeOrFolder as Server.RecipeManagement.FolderRecipe);
            }
        }
    };
    iterateRecipes('', recipeList);
    return result;
}

Functions.registerFunctionEx('ListRecipesAsReferenceArray', 'TcHmi.Functions.RecipeManagementSample', ListRecipesAsReferenceArray);
