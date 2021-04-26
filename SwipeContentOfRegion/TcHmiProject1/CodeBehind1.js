// Keep this lines for a best effort IntelliSense of Visual Studio 2017.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.d.ts" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Controls\System\TcHmiControl\Source.d.ts" />

// Keep this lines for a best effort IntelliSense of Visual Studio 2013/2015.
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\Lib\jquery\jquery.js" />
/// <reference path="C:\TwinCAT\Functions\TE2000-HMI-Engineering\Infrastructure\TcHmiFramework\Latest\TcHmi.js" />

(function (TcHmi) {
    // If you want to unregister an event outside the event code you need to use the return value of the method register()
    var destroyOnInitialized = TcHmi.EventProvider.register('onInitialized', function (e, data) {
        // This event will be raised only once, so we can free resources. 
        // It's best practice to use destroy function of the event object within the callback function to avoid conflicts.
        e.destroy();
        // ----------------------
        // Place your code here!
        // ----------------------
        // ----------------------
        // Place your code here!
        // ----------------------
        // Used to store current animation view for determination what is next view.
        let focusIndex = 0;
        // Used to store TcHmiContent object from Region1 for manipulation.
        let content1 = null;
        // Used to match onTouchMove results with onTouchStart result for determination if animation should be started.
        let touchEventStart = null;
        // Used to destroy onTouchMove event
        let destroyEventTouchMove = null;
        // Btn1 - Sets left position of Content1 to move left region on Content1 into focus.
        TcHmi.EventProvider.register('Btn1.onPressed', (e, data) => {
            if (!content1) {
                return;
            }
            focusIndex = 0; // Left region on Content1 is now in focus. 
            content1.setLeft(0); // Set left to 0 to get first region on Content1 into focus.
        });
        // Btn2 - Sets left position of Content1 to move middle region on Content1 into focus.
        TcHmi.EventProvider.register('Btn2.onPressed', (e, data) => {
            if (!content1) {
                return;
            }
            focusIndex = 1; // Middle region on Content1 is now in focus. 
            content1.setLeft(-800); // Set left to -800 to get middle region on Content1 into focus.
        });
        // Btn3 - Sets left position of Content1 to move right region on Content1 into focus.
        TcHmi.EventProvider.register('Btn3.onPressed', (e, data) => {
            if (!content1) {
                return;
            }
            focusIndex = 2; // Right region on Content1 is now in focus. 
            content1.setLeft(-1600); // Set left to -1600 to get middle region on Content1 into focus.
        });
        // Fetch Content1 object if available in DOM.
        TcHmi.EventProvider.register('Content1.onAttached', (e, data) => {
            content1 = data;
        });
        // Reset content1 if Content1 is no longer available in the DOM.
        TcHmi.EventProvider.register('Content1.onDetached', (e, data) => {
            content1 = null;
        });
        // Store TouchEvent on onTouchStart event and register ononTouchMove event.
        TcHmi.EventProvider.register('Content1.onTouchStart', (e, data) => {
            touchEventStart = data;
            if (destroyEventTouchMove) {
                destroyEventTouchMove();
                destroyEventTouchMove = null;
            }
            destroyEventTouchMove = TcHmi.EventProvider.register('Content1.onTouchMove', (e, data) => {
                if (!touchEventStart) {
                    return;
                }
                let deltaX = data.touches[0].clientX - touchEventStart.touches[0].clientX; // Calculate how far touch (finger) was moved since onTouchStart.
                let limit = 20; // Used to determine how far the touch (finger) has to be moved to trigger animation.
                switch (focusIndex) {
                    case 0: // Left region on Content1 is in focus
                        if (deltaX < -limit) { // Move to the left to get middle region on Content1 into focus.
                            focusIndex = 1;
                            content1 === null || content1 === void 0 ? void 0 : content1.setLeft(-800);
                            // Content moved into focus. Destroy onTouchMove event to avoid further move actions for this touch interaction.
                            if (destroyEventTouchMove) {
                                destroyEventTouchMove();
                                destroyEventTouchMove = null;
                            }
                        }
                        break;
                    case 1: // Middle region on Content1 is in focus
                        if (deltaX < -limit) { // Move to the left to get right region on Content1 into focus.
                            focusIndex = 2;
                            content1 === null || content1 === void 0 ? void 0 : content1.setLeft(-1600);
                            // Content moved into focus. Destroy onTouchMove event to avoid further move actions for this touch interaction.
                            if (destroyEventTouchMove) {
                                destroyEventTouchMove();
                                destroyEventTouchMove = null;
                            }
                        }
                        else if (deltaX > limit) { // Move to the right to get left region on Content1 into focus.
                            focusIndex = 0;
                            content1 === null || content1 === void 0 ? void 0 : content1.setLeft(0);
                            // Content moved into focus. Destroy onTouchMove event to avoid further move actions for this touch interaction.
                            if (destroyEventTouchMove) {
                                destroyEventTouchMove();
                                destroyEventTouchMove = null;
                            }
                        }
                        break;
                    case 2: // Right region on Content1 is in focus
                        // Move to the right to get middle region on Content1 into focus.
                        if (deltaX > limit) {
                            focusIndex = 1;
                            content1 === null || content1 === void 0 ? void 0 : content1.setLeft(-800);
                            // Content moved into focus. Destroy onTouchMove event to avoid further move actions for this touch interaction.
                            if (destroyEventTouchMove) {
                                destroyEventTouchMove();
                                destroyEventTouchMove = null;
                            }
                        }
                        break;
                }
            });
        });
    });
})(TcHmi);
