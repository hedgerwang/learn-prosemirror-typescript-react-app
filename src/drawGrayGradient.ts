// @flow

export default function drawGrayGradient(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  canvas.width = width;
  canvas.height = height;

  // Create gradient
  var grd = ctx.createLinearGradient(0, 0, width, height);
  grd.addColorStop(0, "#000");
  grd.addColorStop(1, "#fff");

  // Fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);
}
