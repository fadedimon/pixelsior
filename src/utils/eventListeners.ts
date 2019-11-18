export function createEventListeners<T>() {
    let list: T[] = [];

    return {
        add(listener: T) {
            list.push(listener);
        },
        emit(...args) {
            // @ts-ignore -- Don't know how to get argument types from function type of interface
            list.forEach((listener) => listener(...args));
        },
    };
}
