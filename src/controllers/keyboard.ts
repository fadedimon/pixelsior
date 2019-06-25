import { BaseControllerParams } from '../_types';
import { moveImage, removeImage } from '../_actionCreators';

export function createKeyboardController(params: BaseControllerParams) {
    const { store } = params;

    window.addEventListener('keydown', (e) => {
        const { keyCode, shiftKey, ctrlKey, altKey, metaKey } = e;

        if (![37, 38, 39, 40, 8, 46].includes(keyCode)) {
            return;
        }

        e.preventDefault();

        const { selectedImageId, images } = store.getState();
        const selectImage = selectedImageId && images.find((image) => image.id === selectedImageId);

        if (selectImage) {
            if ([8, 46].includes(keyCode)) {
                return store.dispatch(removeImage(selectedImageId));
            }

            const multiplier = shiftKey ? 10 : ctrlKey ? 20 : altKey ? 30 : metaKey ? 40 : 1;
            const diffX = keyCode === 39 ? 1 : keyCode === 37 ? -1 : 0;
            const diffY = keyCode === 40 ? 1 : keyCode === 38 ? -1 : 0;

            store.dispatch(
                moveImage({
                    id: selectedImageId,
                    x: selectImage.coords.x + diffX * multiplier,
                    y: selectImage.coords.y + diffY * multiplier,
                }),
            );
        }
    });

    return {};
}
