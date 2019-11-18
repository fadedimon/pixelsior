import { BaseControllerParams } from '../_types';
import { moveImage, removeImage, setCanvasZoom, resetCanvasZoom } from '../_actionCreators';

export function createKeyboardController(params: BaseControllerParams) {
    const { store } = params;

    window.addEventListener('keydown', (e) => {
        const { keyCode, shiftKey, ctrlKey, altKey, metaKey } = e;
        const moveKeys = [37, 38, 39, 40];
        const removeKeys = [8, 46];
        const zoomKeys = [187, 189, 48];

        if (![...moveKeys, ...removeKeys, ...zoomKeys].includes(keyCode)) {
            return;
        }

        e.preventDefault();

        if (zoomKeys.includes(keyCode)) {
            if (keyCode === 48) {
                if (metaKey) {
                    store.dispatch(resetCanvasZoom());
                }
                return;
            }

            const { canvasZoom } = store.getState();
            const zoomDirection = keyCode === 187 ? 1 : -1;
            const zoomMultilier = metaKey || shiftKey || ctrlKey || altKey ? 0.2 : 0.05;
            store.dispatch(setCanvasZoom(canvasZoom + zoomDirection * zoomMultilier));
            return;
        }

        const { selectedImageId, images } = store.getState();
        const selectedImage = selectedImageId && images.find((image) => image.id === selectedImageId);

        if (selectedImage) {
            if (removeKeys.includes(keyCode)) {
                return store.dispatch(removeImage(selectedImageId));
            }

            const multiplier = shiftKey ? 10 : ctrlKey ? 20 : altKey ? 30 : metaKey ? 40 : 1;
            const diffX = keyCode === 39 ? 1 : keyCode === 37 ? -1 : 0;
            const diffY = keyCode === 40 ? 1 : keyCode === 38 ? -1 : 0;

            store.dispatch(
                moveImage({
                    id: selectedImageId,
                    x: selectedImage.coords.x + diffX * multiplier,
                    y: selectedImage.coords.y + diffY * multiplier,
                }),
            );
        }
    });

    return {};
}
