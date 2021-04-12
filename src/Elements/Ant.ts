import { Position } from "../Math/Position";
import { Vector } from "../Math/Vector";
import { CircularElement } from "./Base";

const COLOR_RED = '#ff5555';
const COLOR_GREEN = 'green';
const COLOR_BLUE = 'cyan';

export class Ant extends CircularElement {
  location = new Vector();
  homelocation: Position;

  radius: number = 1.6;
  public set color(c: string) {
    this.ctx.strokeStyle = c;
    this.ctx.fillStyle = c;
  }

  constructor(ctx: CanvasRenderingContext2D, homePosition: Position) {
    super(ctx);
    this.location = new Vector();
    this.homelocation = homePosition;
  }

  body() {
    this.color = COLOR_RED;
    super.body();
  }

  checkWallCollision() {
    const { x , y} = this.location;
    // wall collision detection
    return x < this.location.velocity
    || x > (this.ctx.canvas.width - this.location.velocity)
    || y < this.location.velocity
    || y > (this.ctx.canvas.height - this.location.velocity)
  }

  checkOtherAntsCollision(otherAnts: Ant[]) {
    return !!otherAnts.find(otherAnt => this.location.velocity > this.distanceBetween(otherAnt));
  }

  randomWalk() {
    const currentX = this.location.x;
    const currentY = this.location.y;
    const stepInRandomDirection = () => {
      this.location.stepInDirection(this.location.direction + ((Math.random() - 0.5) * 30));
    }
    stepInRandomDirection();
    while(this.checkWallCollision()) {
      this.location.x = currentX;
      this.location.y = currentY;
      stepInRandomDirection();
    }
  }

  draw(otherAnts: Ant[]) {
    if (!this.checkOtherAntsCollision(otherAnts)) {
      this.randomWalk()
    }
    super.draw();
  }
}