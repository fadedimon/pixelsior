/**
 * Returns pointer position
 */
export function getPointerPosition(e: MouseEvent | TouchEvent) {
    return (
        getMouseEventPosition(e as MouseEvent) ||
        getTouchEventPosition(e as TouchEvent) || {
            x: 0,
            y: 0,
        }
    );
}

function getMouseEventPosition(e: MouseEvent) {
    return {
        x: e.clientX,
        y: e.clientY,
    };
}

function getTouchEventPosition(e: TouchEvent) {
    const { touches, changedTouches } = e;

    if (touches && touches.length > 0) {
        return {
            x: touches[0].clientX,
            y: touches[0].clientY,
        };
    } else if (changedTouches && changedTouches.length > 0) {
        return {
            x: changedTouches[0].clientX,
            y: changedTouches[0].clientY,
        };
    }

    return;
}
