import { combineReducers } from 'redux';

import { images, State as ImagesState } from './images';
import { selectedImageId, State as SelectedImageIdState } from './selectedImageId';
import { canvasDpi, State as CanvasDpiState } from './canvasDpi';
import { canvasZoom, State as CanvasZoomState } from './canvasZoom';
import { canvasPosition, State as CanvasPositionState } from './canvasPosition';

export type State = {
    images: ImagesState;
    selectedImageId: SelectedImageIdState;
    canvasDpi: CanvasDpiState;
    canvasZoom: CanvasZoomState;
    canvasPosition: CanvasPositionState;
};

export const reducers = combineReducers({
    images,
    selectedImageId,
    canvasDpi,
    canvasZoom,
    canvasPosition,
});
