// Contains a set of useful functions used by the project

// Simple delay function for timing
export function delay(time) {
    return new Promise(function(resolve, reject) {
      setTimeout(() => resolve(), time);
    });
}
