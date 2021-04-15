import { Position } from "../Math/Position";
import { BaseElement, CircularElement } from "./Base";

export class Step extends CircularElement {
  location = new Position();
  radius = 1.6;
  
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
    super(ctx);
    this.location.x = x;
    this.location.y = y;
    this.draw();
  }

  body() {
    this.ctx.strokeStyle = '#0000ff';
    this.ctx.fillStyle = '#0000ff';
    super.body();
  }
}

export class Trail extends BaseElement {
  path: Step[] = [];
  maxLength = 100;
  step = 0;

  update(location: Position) {
    if (this.step === 0) {
      if (!(this.path.length < this.maxLength)) {
        const [,...trail] = this.path;
        this.path = trail;
      }
      this.path = [...this.path, new Step(this.ctx, location.x, location.y)];
    }
    if(this.step === 4) {
      this.step = 0;
    } else {
      this.step++;
    }
  }

  reset() {
    this.step = 0;
    this.path = [];
  }

  body() { }
}