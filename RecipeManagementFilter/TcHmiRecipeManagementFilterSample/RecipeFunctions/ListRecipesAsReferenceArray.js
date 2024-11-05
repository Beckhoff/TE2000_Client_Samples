// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

(function (/** @type {globalThis.TcHmi} */ TcHmi) {

    /**
     * @param ctx {TcHmi.Context<string[]>}
     * @param recipeList {TcHmi.Server.RecipeManagement.FolderRecipe}
     * @param filterText {string}
     */
    var ListRecipesAsReferenceArray = function (ctx,recipeList,filterText) {
        if (!recipeList) {
            // Inform the system that we are done and have a dummy result
            ctx.success([]);
            return;    // We are running async so the return value is not used
        }
        // Build a flat array out of the recursive object
        /** @type {string[]} */
        var result = [];
        
        // Checks recursive all properties of the recipe folder and remembers recipes
        /**
         * @param currentPath {string}
         * @param recipeFolder {TcHmi.Server.RecipeManagement.FolderRecipe}
         */
        var iterateRecipes = function (currentPath, recipeFolder) {
            for (var subPath in recipeFolder) {
                var currentName = (currentPath ? currentPath + '::' : '') + subPath;
                var recipeOrRecipeFolder = recipeFolder[subPath];

                if (typeof recipeOrRecipeFolder.recipeTypeName === 'string'
                    && recipeOrRecipeFolder.values !== null
                    && typeof recipeOrRecipeFolder.values === 'object') {
                    // Add to array when we have reached a recipe (which has to contain a recipeTypeName and a values object) and the entered filter text is part of the recipe's name
                    if ((currentName.indexOf(filterText) !== -1) || filterText === '') {                    
						result.push(currentName);
					}
                } else {
                    // no recipe found, go deeper
                    iterateRecipes(currentName, recipeOrRecipeFolder);
                }
            }
        }
        // Start iteration at the root of the object
        iterateRecipes('', recipeList);
        // Inform the system that we are done and have a result
        ctx.success(result);
        return;    // We are running async so the return value is not used
    };
        
    TcHmi.Functions.registerFunction('ListRecipesAsReferenceArray', ListRecipesAsReferenceArray);
})(TcHmi);