import { Position } from "../Math/Position";
import { BaseElement, CircularElement } from "./Base";

export class Step extends CircularElement {
  location = new Position();
  radius = 1.6;
  
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
    super(ctx);
    this.location.x = x;
    this.location.y = y;
  }

  body() {
    this.ctx.strokeStyle = '#0000ff';
    this.ctx.fillStyle = '#0000ff';
    super.body();
  }
}

export class Trail extends BaseElement {
  trail: Step[] = [];
  maxLength = 100;
  step = 0;

  update(location: Position) {
    if (this.step === 0) {
      if (!(this.trail.length < this.maxLength)) {
        const [,...trail] = this.trail;
        this.trail = trail;
      }
      this.trail = [...this.trail, new Step(this.ctx, location.x, location.y)];
    }
    if(this.step === 4) {
      this.step = 0;
    } else {
      this.step++;
    }
  }

  body() { }

  draw() {
    this.trail.forEach(step => {
      step.draw();
    })
  }
}