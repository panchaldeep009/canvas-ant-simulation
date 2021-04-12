import { Position } from "../Math/Position";

export abstract class BaseElement {
  abstract location: Position;
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  abstract body() : void;

  draw(..._: any[]) {
    const currentFillStyle = this.ctx.fillStyle;
    const currentStrokStyle = this.ctx.strokeStyle;
    this.body();
    this.ctx.fillStyle = currentFillStyle;
    this.ctx.strokeStyle = currentStrokStyle;
  };
};

export abstract class CircularElement extends BaseElement {
  abstract radius: number;

  body () {
    this.ctx.beginPath();
    this.ctx.arc(this.location.x, this.location.y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }

  distanceBetween(el: CircularElement) {
    return this.location.getDistanceFrom(el.location) - (this.radius + el.radius);
  }
}