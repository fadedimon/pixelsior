let counter = Date.now();

export function getUniqueId() {
    counter += 1;
    return counter;
}
