// This code-behind file switches the slides of SlideStrip in Pages/Usage.content by swiping or with the buttons.
// It is loaded as an ES module (see "dependencyFiles" in Properties/tchmiconfig.json).
// "Beckhoff.TwinCAT.HMI.Framework/*" is mapped to the package folder at runtime (import map) and in tsconfig.json (paths).
import { Controls, EventProvider, type TcHmiContent } from 'Beckhoff.TwinCAT.HMI.Framework/index.esm.js';

/** Number of slides on SlideStrip. */
const SLIDE_COUNT = 3;

/** How far in px a finger or the mouse has to move to switch to the next slide. */
const SWIPE_DISTANCE = 40;

/** Index of the slide which is shown. */
let slideIndex = 0;

/** Removes the pointer event listeners. Only set while SlideStrip is attached. */
let removePointerListeners: (() => void) | null = null;

/**
 * Shows a slide by moving SlideStrip.
 * SlideStrip is three times as wide as the region which shows it and its left position has the unit %,
 * so -100 % moves it by exactly one slide, independent of the size of the region.
 * The transition in Swipe.css animates the move.
 */
function showSlide(index: number) {
    const strip = Controls.get<TcHmiContent.Control>('SlideStrip');
    if (!strip) {
        return;
    }
    slideIndex = Math.min(Math.max(index, 0), SLIDE_COUNT - 1);
    strip.setLeft(-slideIndex * 100);
}

// The pointer events are registered when SlideStrip is attached to the DOM and removed when it is detached.
// Pointer events cover fingers, pens and the mouse with one code path.
// The event passes the attached control as data.
EventProvider.register('SlideStrip.onAttached', (e, strip: TcHmiContent.Control) => {
    // A new strip always starts with the first slide.
    slideIndex = 0;

    const element = strip.getElement()[0];
    /** Horizontal position where the current swipe started. null if there is no swipe. */
    let startX: number | null = null;

    const onPointerDown = (event: PointerEvent) => {
        startX = event.clientX;
    };

    const onPointerMove = (event: PointerEvent) => {
        if (startX === null) {
            return;
        }
        const deltaX = event.clientX - startX; // How far the finger or the mouse moved since the swipe started.
        if (deltaX <= -SWIPE_DISTANCE) {
            // Moved to the left: show the next slide.
            showSlide(slideIndex + 1);
            startX = null; // One swipe switches only one slide.
        } else if (deltaX >= SWIPE_DISTANCE) {
            // Moved to the right: show the previous slide.
            showSlide(slideIndex - 1);
            startX = null;
        }
    };

    const onPointerEnd = () => {
        startX = null;
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerEnd);
    element.addEventListener('pointercancel', onPointerEnd);
    element.addEventListener('pointerleave', onPointerEnd);

    removePointerListeners = () => {
        element.removeEventListener('pointerdown', onPointerDown);
        element.removeEventListener('pointermove', onPointerMove);
        element.removeEventListener('pointerup', onPointerEnd);
        element.removeEventListener('pointercancel', onPointerEnd);
        element.removeEventListener('pointerleave', onPointerEnd);
    };
});

EventProvider.register('SlideStrip.onDetached', () => {
    removePointerListeners?.();
    removePointerListeners = null;
});

// The buttons below the region show a slide directly.
EventProvider.register('SlideButton1.onPressed', () => {
    showSlide(0);
});

EventProvider.register('SlideButton2.onPressed', () => {
    showSlide(1);
});

EventProvider.register('SlideButton3.onPressed', () => {
    showSlide(2);
});
