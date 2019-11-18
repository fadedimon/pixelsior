import { handleActions } from 'redux-actions';
import { setCanvasZoom, resetCanvasZoom } from '../_actionCreators';

export type State = number;

export const canvasZoom = handleActions<State, number>(
    {
        [setCanvasZoom.toString()]: (state, { payload }) => {
            return payload || state;
        },
        [resetCanvasZoom.toString()]: () => 1,
    },
    1,
);
