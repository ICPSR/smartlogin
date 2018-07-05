// Contains a set of useful functions and constants used by the project

// Opacity of buttons when they're pressed down.
export const BUTTON_ACTIVE_OPACITY = 0.6;

// Simple delay function for timing
export function delay(time) {
    return new Promise(function(resolve, reject) {
        setTimeout(() => resolve(), time);
    });
}


// Wrapper for the fetch() call that provides timeout functionality.
export async function fetchWithTimeout(URL, init){
    const TIMEOUT = 5 * 1000;   // timeout in milliseconds
    let timer;

    // Run both promises simultaneously.
    let result = await Promise.race([
        // Makes the fetch request and waits for it.
        new Promise(async (resolve, reject) => {
            let response = await fetch(URL, init);
            resolve(response);
        }),
        // Aborts the fetch when the timer finishes.
        new Promise((resolve, reject) => {
            timer = setTimeout(() => {
                //abortController.abort();
                reject(new Error("Request timed out"));
            }, TIMEOUT);
        })
    ]);

    // Cleans the timer up if it's still running.
    clearTimeout(timer);

    // On a successful response, return the promised object.
    return result;
}
