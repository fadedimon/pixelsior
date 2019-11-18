import { Coords, BaseControllerParams } from '../_types';
import { getDeviceDpi } from '../utils/getDeviceDpi';
import { setCanvasDpi, selectImage, moveImage, unSlectImage, moveCanvas } from '../_actionCreators';
import { getImageByCoords } from '../selectors/getImageByCoords';
import { BendingOption } from '../_enums';
import { getPointerPosition } from '../utils/getPointerPosition';

type CanvasControllerParams = BaseControllerParams & {
    elem: HTMLCanvasElement;
};

type InnerState = {
    pointerInitialCoords: Coords;
    canvasInitialCoords?: Coords;
    currImageInitialCoords?: Coords;
    currImageId?: number;
};

type CanvasController = {};

export function createCanvasController(params: CanvasControllerParams): CanvasController {
    function render() {
        function getPos(value: number) {
            return value * canvasZoom * canvasDpi;
        }

        const { images, selectedImageId, canvasPosition, canvasZoom, canvasDpi } = store.getState();

        ctx.clearRect(0, 0, ctxWidth, ctxHeight);

        images.forEach((image) => {
            const width = getPos(image.width);
            const height = getPos(image.height);
            const x = getPos(canvasPosition.x + image.coords.x) - width / 2;
            const y = getPos(canvasPosition.y + image.coords.y) - height / 2;

            ctx.save();
            ctx.globalCompositeOperation = globalCompositeOperation(image.bendingOption);
            ctx.drawImage(image.elem, x, y, width, height);
            ctx.restore();
        });

        const selected = images.find((image) => image.id === selectedImageId);

        if (selected) {
            const radius = 10;
            const width = getPos(selected.width) + radius * 2;
            const height = getPos(selected.height) + radius * 2;
            const x = getPos(canvasPosition.x + selected.coords.x) - width / 2;
            const y = getPos(canvasPosition.y + selected.coords.y) - height / 2;

            ctx.save();
            ctx.lineJoin = 'round';
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'rgba(156, 39, 176, 0.9)';

            ctx.globalCompositeOperation = 'multiply';

            ctx.beginPath();
            ctx.moveTo(x, y + radius);
            ctx.arc(x + radius, y + radius, radius, Math.PI, (-1 * Math.PI) / 2);
            ctx.lineTo(x + width - radius, y);
            ctx.arc(x + width - radius, y + radius, radius, (-1 * Math.PI) / 2, 0);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
            ctx.lineTo(x + radius, y + height);
            ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
            ctx.closePath();
            ctx.stroke();

            ctx.restore();
        }
    }

    function handleDragging(e: MouseEvent | TouchEvent) {
        e.preventDefault();

        const { x, y } = getPointerPosition(e);
        const { pointerInitialCoords, canvasInitialCoords, currImageId, currImageInitialCoords } = innerState;
        const diffX = x - pointerInitialCoords.x;
        const diffY = y - pointerInitialCoords.y;

        if (currImageId && currImageInitialCoords) {
            store.dispatch(
                moveImage({
                    id: currImageId,
                    x: currImageInitialCoords.x + diffX,
                    y: currImageInitialCoords.y + diffY,
                }),
            );
        } else if (canvasInitialCoords) {
            store.dispatch(
                moveCanvas({
                    x: canvasInitialCoords.x + diffX,
                    y: canvasInitialCoords.y + diffY,
                }),
            );
        }
    }

    function handleDragEnd(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        toggleGlobalEventsListeners(false);
    }

    function toggleGlobalEventsListeners(flag: boolean) {
        const action = `${flag ? 'add' : 'remove'}EventListener`;
        const moveOptions = flag ? { passive: false } : undefined;

        window[action]('mousemove', handleDragging, moveOptions);
        window[action]('touchmove', handleDragging, moveOptions);
        window[action]('mouseup', handleDragEnd);
        window[action]('touchend', handleDragEnd);
        window[action]('touchcancel', handleDragEnd);
    }

    const { store, elem } = params;
    const ctx = elem.getContext('2d');
    const dpi = getDeviceDpi(ctx);
    const ctxWidth = window.innerWidth * dpi;
    const ctxHeight = window.innerHeight * dpi;

    let innerState: InnerState = {
        pointerInitialCoords: {
            x: 0,
            y: 0,
        },
    };

    ctx.canvas.width = ctxWidth;
    ctx.canvas.height = ctxHeight;

    store.dispatch(setCanvasDpi(dpi));
    store.subscribe(render);

    elem.addEventListener('click', (e) => {
        const image = getImageByCoords(store.getState(), { x: e.clientX, y: e.clientY });

        if (image) {
            store.dispatch(selectImage(image));
        } else {
            store.dispatch(unSlectImage());
        }
    });

    elem.addEventListener('mousedown', (e) => {
        const state = store.getState();
        const pointerInitialCoords = getPointerPosition(e);
        const image = getImageByCoords(state, pointerInitialCoords);

        if (image) {
            store.dispatch(selectImage(image));
            innerState = {
                pointerInitialCoords,
                currImageId: image.id,
                currImageInitialCoords: {
                    ...image.coords,
                },
            };
        } else {
            innerState = {
                pointerInitialCoords,
                canvasInitialCoords: {
                    ...state.canvasPosition,
                },
            };
        }

        toggleGlobalEventsListeners(true);
    });

    elem.addEventListener('mousewheel', (e: MouseWheelEvent) => {
        e.preventDefault();

        const { x, y } = store.getState().canvasPosition;

        store.dispatch(
            moveCanvas({
                x: x - e.deltaX,
                y: y - e.deltaY,
            }),
        );
    });

    return {};
}

function globalCompositeOperation(value: BendingOption) {
    switch (value) {
        case BendingOption.Difference: {
            return 'difference';
        }
        default: {
            return 'normal';
        }
    }
}
