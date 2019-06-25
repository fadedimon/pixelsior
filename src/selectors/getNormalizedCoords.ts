import { State } from '../reducers';

export function getNormalizedCoords(state: State, { x, y }) {
    const { canvasPosition } = state;
    return {
        x: x - canvasPosition.x,
        y: y - canvasPosition.y,
    };
}
