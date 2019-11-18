import { handleActions } from 'redux-actions';

import { Img } from '../_types';
import { addImage, moveImage, removeImage, MoveImagePayload } from '../_actionCreators';

export type State = Img[];

export const images = handleActions<State, Img | MoveImagePayload | number>(
    {
        [addImage.toString()]: (state, { payload }) => {
            if (payload as Img) {
                return state.concat(payload as Img);
            }

            return state;
        },
        [moveImage.toString()]: (state, { payload }) => {
            if (payload as MoveImagePayload) {
                const { id, x, y } = payload as MoveImagePayload;

                return state.map((image) => {
                    if (image.id === id) {
                        return {
                            ...image,
                            coords: {
                                x,
                                y,
                            },
                        };
                    }

                    return image;
                });
            }

            return state;
        },
        [removeImage.toString()]: (state, { payload }) => {
            return state.filter((image) => image.id !== (payload as number));
        },
    },
    [] as Img[],
);
