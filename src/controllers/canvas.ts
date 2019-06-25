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

        const { images, canvasPosition, canvasZoom, canvasDpi } = store.getState();

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
