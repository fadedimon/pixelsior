/**
 * Returns device's DPI
 * @param  {CanvasRenderingContext2D} ctx
 * @return {number}
 */
export function getDeviceDpi(ctx: CanvasRenderingContext2D) {
    return window.devicePixelRatio || 1;
}
