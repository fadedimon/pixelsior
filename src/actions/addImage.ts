import { BendingOption } from '../_enums';
import { Store, Coords } from '../_types';
import { addImage as _addImage } from '../_actionCreators';

import { loadImage } from '../utils/loadImage';
import { getUniqueId } from '../utils/getUniqueId';
import { getNormalizedCoords } from '../selectors/getNormalizedCoords';

type AddImageOptions = {
    coords: Coords;
    bendingOption: BendingOption;
};

export type AddImageFunc = (store: Store, file: File, { coords, bendingOption }: AddImageOptions) => void;

export const addImage: AddImageFunc = async (store, file, { coords, bendingOption }) => {
    const image = await loadImage(file);
    const state = store.getState();
    const { x, y } = getNormalizedCoords(state, coords);

    const width = image.width / state.canvasDpi;
    const height = image.height / state.canvasDpi;

    store.dispatch(
        _addImage({
            width,
            height,
            bendingOption,
            elem: image,
            origWidth: image.width,
            origHeight: image.height,
            coords: getNormalizedCoords(state, coords),
            id: getUniqueId(),
        }),
    );
};
