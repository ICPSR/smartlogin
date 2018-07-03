// Contains a set of useful functions and constants used by the project

// Opacity of buttons when they're pressed down.
const BUTTON_ACTIVE_OPACITY = 0.6;

// Simple delay function for timing
export function delay(time) {
    return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(), time);
    });
}
