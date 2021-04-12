import { BaseElement } from "./Base";

export class Food implements BaseElement {
  x: number;
  y: number;
  r: number = 80;
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
  }

  draw() {
    this.ctx.strokeStyle = '#22FF22';
    this.ctx.fillStyle = '#00000000';
    drawCicle(this.ctx, this.x, this.y, this.r);
  };
}