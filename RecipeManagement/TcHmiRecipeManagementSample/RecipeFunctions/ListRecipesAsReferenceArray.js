// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

(function (TcHmi) {

    var ListRecipesAsReferenceArray = function (ctx, recipeList) {
        if (!recipeList) {
            // Inform the system that we are done and have a dummy result
            ctx.success([]);
            return;    // We are running async so the return value is not used
        }
        // Build a flat array out of the recursive object
        var result = [];
        
        // Checks recursive all properties of the recipe folder and remember recipes
        var iterateRecipes = function (currentPath, recipeFolder) {
            for (var subPath in recipeFolder) {
                var currentName = (currentPath ? currentPath + '::' : '') + subPath;
                var recipeOrRecipeFolder = recipeFolder[subPath];

                if (
                    typeof recipeOrRecipeFolder.recipeTypeName === 'string'
                    && recipeOrRecipeFolder.values !== null
                    && typeof recipeOrRecipeFolder.values === 'object'
                ) {
                    // Add to array when we have reached an recipe (which has to contain a recipeTypeName and a values object)
                    result.push(currentName);
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