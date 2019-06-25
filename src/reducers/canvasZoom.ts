import { handleActions } from 'redux-actions';

export type State = number;

export const canvasZoom = handleActions<State>({}, 1);
