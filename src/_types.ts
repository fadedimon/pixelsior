import { Store as ReduxStore } from 'redux';

import { State } from './reducers';
import { BendingOption } from './_enums';

export type Store = ReduxStore<State>;

export type BaseControllerParams = {
    store: Store;
};

export type Coords = {
    x: number;
    y: number;
};

export type Img = {
    id: number;
    elem: HTMLImageElement;
    origWidth: number;
    origHeight: number;
    width: number;
    height: number;
    coords: Coords;
    bendingOption: BendingOption;
};
