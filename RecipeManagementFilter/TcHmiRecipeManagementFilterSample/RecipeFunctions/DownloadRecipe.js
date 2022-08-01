// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

(function (TcHmi) {

    /**
     * 
     * @param {TcHmi.Context} ctx
     * @param {string} recipeReference
     */
    var DownloadRecipe = function (ctx, recipeReference) {
        if (!recipeReference) {
            // Stop (not abort) with null (binding without a value) or empty string
            ctx.success();

            return;    // We are running async so the return value is not used
        }

        TcHmi.Server.readSymbol("TcHmiRecipeManagement.Config::recipeList::" + recipeReference, function (data) {
            if (data.error) {
                // Inform the system that we are done but had an error
                ctx.error(data.error, {
                    code: data.error,
                    message: TcHmi.Errors[data.error],
                    reason: 'Function: DownloadRecipe, Recipe ' + recipeReference + ' fetching failed',
                    domain: 'Function',
                    errors: (data.details ? [data.details] : undefined)
                });

                return;    // We are running async so the return value is not used
            } else {
                // Create a dummy HTMLAnchorElement
                var downloaderAElement = document.createElement('a');

                // Define a nice download name 
                downloaderAElement.download = recipeReference.replace(/::/g, '_') + '.json';

                // Do not manipulate the incoming object
                let jsonExport = tchmi_clone_object(data.response);

                // Convert to an export
                jsonExport.commands[0].writeValue = jsonExport.commands[0].readValue;
                delete jsonExport.commands[0].readValue;
                delete jsonExport.sessionId;
                delete jsonExport.id;

                // Prepare "download" content
                downloaderAElement.href = 'data:application/json;utf8,' +
                    JSON.stringify(jsonExport, null, 2);
                // Hide dummy element to prevent visual impact
                downloaderAElement.style.display = 'none';
                // Append dummy element, so even Firefox allows a simulated click.
                document.body.appendChild(downloaderAElement);
                // Simulate a click. Works probably only if this action is triggered by a user interaction (not on load or symbol change)
                downloaderAElement.click();
                // Remove dummy element
                document.body.removeChild(downloaderAElement);

                // Inform the system that we are done
                ctx.success();
                return;    // We are running async so the return value is not used
            }
        });

        return;    // We are running async so the return value is not used
    };

    TcHmi.Functions.registerFunction('DownloadRecipe', DownloadRecipe);
})(TcHmi);