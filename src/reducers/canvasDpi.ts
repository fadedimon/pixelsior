import { handleActions } from 'redux-actions';

import { setCanvasDpi } from '../_actionCreators';

export type State = number;

export const canvasDpi = handleActions<State, number>(
    {
        [setCanvasDpi.toString()]: (state, { payload }) => {
            return payload | state;
        },
    },
    2,
);
