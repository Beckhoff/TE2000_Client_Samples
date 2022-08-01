// @ts-check    <- activates more IntelliSense checks in this file
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
     */
    var UploadRecipe = function (ctx) {
        if (typeof FileReader === 'undefined') {
            ctx.error(TcHmi.Errors.E_NOT_SUPPORTED, {
                code: TcHmi.Errors.E_NOT_SUPPORTED,
                message: TcHmi.Errors[TcHmi.Errors.E_NOT_SUPPORTED],
                reason: 'The Browser does not support the FileReader API.'
            });
            return;
        }

        // Create a dummy HTMLAnchorElement
        var inputElement = document.createElement('input');

        inputElement.type = 'file';
        inputElement.accept = '.json';
        inputElement.multiple = true;

        var pendingFileCount = 0;

        inputElement.addEventListener('change', function (data) {
            if (inputElement.files) {
                pendingFileCount += inputElement.files.length;
                for (var i = 0, numFiles = inputElement.files.length; i < numFiles; i++) {
                    var file = inputElement.files[i];
                    var reader = new FileReader();
                    reader.addEventListener('loadend', function (data2) {
                        var request = TcHmi.ValueConverter.toObject(reader.result);
                        if (request && request.commands && request.commands[0]) {
                            var command = request.commands[0];
                            if (pendingFileCount <= 0) {
                                // abort in error state
                                return;
                            }
                            TcHmi.Server.RecipeManagement.createRecipe(
                                command.symbol.replace('TcHmiRecipeManagement.Config::recipeList::', ''),
                                null,
                                command.writeValue,
                                function (data3) {
                                    if (!data3.error) {
                                        pendingFileCount--;
                                        if (pendingFileCount <= 0) {
                                            ctx.success();
                                        }
                                    } else {
                                        if (pendingFileCount <= 0) {
                                            // abort in error state
                                            return;
                                        }
                                        pendingFileCount = 0;
                                        ctx.error(data3.error, data3.details);
                                    }
                                }
                            );
                        } else {
                            if (pendingFileCount <= 0) {
                                // abort in error state
                                return;
                            }
                            pendingFileCount = 0;
                            ctx.error(TcHmi.Errors.ERROR);
                        }
                    });
                    reader.addEventListener('error', function (data2) {
                        if (pendingFileCount <= 0) {
                            // abort in error state
                            return;
                        }
                        pendingFileCount = 0;
                        ctx.error(TcHmi.Errors.ERROR);
                    });
                    reader.readAsText(file);
                }
            } else {
                if (pendingFileCount <= 0) {
                    // abort in error state
                    return;
                }
                pendingFileCount = 0;
                ctx.error(TcHmi.Errors.ERROR);
            }
        });
        // Simulate a click. Works probably only if this action is triggered by a user interaction (not on load or symbol change)
        inputElement.click();

        return;    // We are running async so the return value is not used
    };

    TcHmi.Functions.registerFunction('UploadRecipe', UploadRecipe);
})(TcHmi);