export class Position {
  x: number = 0;
  y: number = 0;

  /** Distance from another vector */
  getDistanceFrom(target: Position) {
    return Math.sqrt(Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2))
  }
}