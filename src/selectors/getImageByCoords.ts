import { Coords, Img } from '../_types';
import { State } from '../reducers';

import { getNormalizedCoords } from './getNormalizedCoords';

function isAtCoords(image: Img, x: number, y: number) {
    const halfWidth = image.width / 2;
    const halfHeight = image.height / 2;
    const matchByX = x >= image.coords.x - halfWidth && x <= image.coords.x + halfWidth;
    const matchByY = y >= image.coords.y - halfHeight && y <= image.coords.y + halfHeight;

    return matchByX && matchByY;
}

export function getImageByCoords(state: State, coords: Coords) {
    const { x, y } = getNormalizedCoords(state, coords);
    return state.images.reduce((result, image) => {
        if (isAtCoords(image, x, y)) {
            return image;
        }
        return result || undefined;
    }, undefined);
}
