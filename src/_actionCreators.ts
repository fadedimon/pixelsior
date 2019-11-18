import { createAction } from 'redux-actions';

import { Img, Coords } from './_types';

export type MoveImagePayload = Coords & {
    id: number;
};

export const addImage = createAction<Img>('addImage');
export const selectImage = createAction<Img>('selectImage');
export const unSlectImage = createAction('unSlectImage');
export const moveImage = createAction<MoveImagePayload>('moveImage');
export const removeImage = createAction<number>('removeImage');

export const moveCanvas = createAction<Coords>('moveCanvas');
export const setCanvasDpi = createAction<number>('setCanvasDpi');
export const setCanvasZoom = createAction<number>('setCanvasZoom');
export const resetCanvasZoom = createAction('resetCanvasZoom');
