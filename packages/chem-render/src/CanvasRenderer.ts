export class CanvasRenderer {
  drawTestGrid(ctx: CanvasRenderingContext2D): void {
    const { canvas } = ctx;
    const size = 10;
    const { width, height } = canvas;
    ctx.strokeStyle = '#ddd';
    for (let x = 0; x <= width; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
}
