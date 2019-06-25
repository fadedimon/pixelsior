import { handleActions } from 'redux-actions';

import { Img } from '../_types';
import { selectImage, addImage, unSlectImage } from '../_actionCreators';

export type State = number;

export const selectedImageId = handleActions<State, Img>(
    {
        [selectImage.toString()]: (state, { payload }) => {
            return payload ? payload.id : state;
        },
        [unSlectImage.toString()]: () => {
            return -1;
        },
        [addImage.toString()]: (state, { payload }) => {
            if (payload) {
                return payload.id;
            }

            return state;
        },
    },
    -1,
);
