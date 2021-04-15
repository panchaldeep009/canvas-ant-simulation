import { Position } from "../Math/Position";
import { Vector } from "../Math/Vector";
import { CircularElement } from "./Base";
import { Food } from "./Food";
import { Trail } from "./Trail";

const COLOR_RED = '#ff5555';
const COLOR_GREEN = 'green';
const COLOR_BLUE = 'cyan';

export class Ant extends CircularElement {
  location = new Vector();
  homelocation: Position;
  walkingTrail: Trail;
  carryingFood?: Food;

  radius: number = 1.6;
  public set color(c: string) {
    this.ctx.strokeStyle = c;
    this.ctx.fillStyle = c;
  }

  constructor(ctx: CanvasRenderingContext2D, homePosition: Position) {
    super(ctx);
    this.location = new Vector();
    this.homelocation = homePosition;
    this.walkingTrail = new Trail(ctx);
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

  getNearByFood(foods: Food[]) {
    return foods
      .filter(food => food.distanceBetween(this) < 15)
      .reduce((currentFood: Food | undefined, food: Food) => {
        if (!currentFood) {
          return food;
        }
        return food.distanceBetween(this) < currentFood.distanceBetween(this) ?
          food : currentFood
      }, undefined);
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
    this.walkingTrail.update(this.location);
  }

  draw(otherAnts: Ant[], foods: Food[]) {
    if (!this.checkOtherAntsCollision(otherAnts)) {
      if (!this.carryingFood) {
        const nearbyFood = this.getNearByFood(foods);
        if (nearbyFood) {
          console.log(nearbyFood);
          console.log(nearbyFood.distanceBetween(this));
          if (nearbyFood.distanceBetween(this) < 1) {
            this.carryingFood = nearbyFood;
          } else {
            this.location.stepTowards(nearbyFood.location);
          }
        } else {
          this.randomWalk();
        }
      }
    } 
    super.draw();
  }
}