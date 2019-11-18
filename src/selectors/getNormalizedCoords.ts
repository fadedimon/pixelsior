import { State } from '../reducers';

export function getNormalizedCoords(state: State, { x, y }) {
    const { canvasPosition } = state;
    return {
        x: Math.ceil(x - canvasPosition.x),
        y: Math.ceil(y - canvasPosition.y),
    };
}
