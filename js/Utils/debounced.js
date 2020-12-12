export default function debounce(cb, wait, thisArg) {
    let timerId;
    let result;

    if (typeof cb !== 'function') {
        throw new TypeError(`expected function got ${typeof cb}`);
    }

    if (!Number.isSafeInteger(wait)) {
        throw new TypeError(`expected number got ${wait}`);
    }

    function cancel() {
        if (timerId) {
            clearTimeout(timerId);
        }
    }

    function delayed(...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            result = cb.call(thisArg, ...args);
        }, wait);
        return result;
    }

    delayed.cancel = cancel;

    return delayed;
}
