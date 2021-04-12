import { Position } from "./Position";

export class Vector extends Position {
  /** Pixels per Frame */
  velocity: number = 3;

  /** Facing degree */
  direction: number = 0

  /** face towards Position in degree */
  faceToward(position: Position) {
    this.direction = Math.atan2((position.y - this.y), (position.x - this.x)) * 180/Math.PI
  }

  /** Step with Velocity */
  step(velocity?: number) {
    this.velocity = velocity || this.velocity;
    const thita = (Math.PI * this.direction) / 180;
    this.x = this.x + (Math.cos(thita) * this.velocity);
    this.y = this.y + (Math.sin(thita) * this.velocity);
  }

  /** Step toward a Position*/
  stepTowards(position: Position, velocity?: number) {
    this.faceToward(position);
    this.step(velocity);
  }

  /** Step in Direction */
  stepInDirection(direction: number, velocity?: number) {
    this.direction = direction;
    this.step(velocity);
  }
}