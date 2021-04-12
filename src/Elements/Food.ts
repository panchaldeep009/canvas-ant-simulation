import { Position } from "../Math/Position";
import { CircularElement } from "./Base";

export class Food extends CircularElement {
  location = new Position();
  radius = 30;

  constructor(ctx: CanvasRenderingContext2D, x: number, y:number) {
    super(ctx)
    this.location.x = x;
    this.location.y = y;
  }

  body() {
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.fillStyle = '#00ff00';
    super.body();
  }
}