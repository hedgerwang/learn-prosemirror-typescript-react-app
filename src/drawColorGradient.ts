// @flow

export default function drawColorGradient(
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
  const gradient = ctx.createLinearGradient(0, height, width, height);

  // https://www.schemecolor.com/
  const colors = [
    "#CC99FF",
    "#A9D1F7",
    "#B4F0A7",
    "#FFFFBF",
    "#FFDFBE",
    "#FFB1B0",
    "#ffffff",
  ];
  colors.forEach((cc, ii) => {
    gradient.addColorStop(ii / colors.length, cc);
  });

  // Fill with gradient
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
