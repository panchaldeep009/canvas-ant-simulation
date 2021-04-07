import { BaseElement } from "./Base";

export class Ant implements BaseElement {
  x: number = 0;
  y: number = 0;
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  draw(r?: number) {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, r || 1, 0, 2 * Math.PI);
    this.ctx.fillStyle = '#ff5500';
    this.ctx.strokeStyle = '#fff';
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  };
}

export class WalkingAnt extends Ant {
  walkingDirection: number;
  distance = 3; 
  constructor (ctx: CanvasRenderingContext2D, walkingDirection: number) {
    super(ctx);
    this.walkingDirection = walkingDirection;
  }

  nextPoint() {
    const thita = (Math.PI * this.walkingDirection) / 180;
    this.x = this.x + (Math.cos(thita) * this.distance);
    this.y = this.y + (Math.sin(thita) * this.distance);
  }

  step(size: number) {
    this.walkingDirection = this.walkingDirection + ((Math.random() - 0.5) * 30);
    const x = this.x;
    const y = this.y;
    this.nextPoint();
    while(
      this.x < this.distance
      || this.x > (this.ctx.canvas.width - this.distance)
      || this.y < this.distance
      || this.y > (this.ctx.canvas.height - this.distance)
    ) {
      this.x = x;
      this.y = y;
      this.walkingDirection = this.walkingDirection - 2;
      this.nextPoint();
    }
    this.draw(size);
  }

  walk() {
    this.step(1.6);
    this.step(1.2);
    this.step(1.2);
  }
}