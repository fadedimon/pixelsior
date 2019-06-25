import { handleActions } from 'redux-actions';

import { Coords } from '../_types';
import { moveCanvas } from '../_actionCreators';

export type State = Coords;

export const canvasPosition = handleActions<State, Coords>(
    {
        [moveCanvas.toString()]: (state, { payload }) => {
            if (payload) {
                return {
                    x: payload.x,
                    y: payload.y,
                };
            }

            return state;
        },
    },
    {
        x: 0,
        y: 0,
    },
);
