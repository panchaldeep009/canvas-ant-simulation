import { Position } from "../Math/Position";
import { Vector } from "../Math/Vector";
import { CircularElement } from "./Base";
import { Food } from "./Food";
import { Step, Trail } from "./Trail";

const COLOR_RED = '#ff5555';
const COLOR_GREEN = 'green';
const COLOR_BLUE = 'cyan';

export class Ant extends CircularElement {
  location = new Vector();
  homelocation: Position;
  walkingTrail: Trail;
  carryingFood?: Food;
  followingTarget?: CircularElement;

  radius: number = 1.6;
  public set color(c: string) {
    this.ctx.strokeStyle = c;
    this.ctx.fillStyle = c;
  }

  constructor(ctx: CanvasRenderingContext2D, backgroundCtx: CanvasRenderingContext2D, homePosition: Position) {
    super(ctx);
    this.location = new Vector();
    this.homelocation = homePosition;
    this.walkingTrail = new Trail(backgroundCtx);
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
    if (this.location.getDistanceFrom(this.homelocation) < 30) {
      this.walkingTrail.reset();
    }
    this.walkingTrail.update(this.location);
  }

  walkTowardsTarget() {
    if (this.followingTarget ) {
      this.location.stepTowards(this.followingTarget.location);
    }
  }

  draw(otherAnts: Ant[], foods: Food[]) {
    // if (!this.checkOtherAntsCollision(otherAnts)) {
      if (!this.carryingFood && !this.followingTarget) {
        const nearbyFood = this.getNearByFood(foods);
        if (nearbyFood) {
          if (nearbyFood.distanceBetween(this) < 1) {
            this.carryingFood = nearbyFood;
            this.followingTarget = undefined;
          } else {
            this.followingTarget = nearbyFood;
          }
        }
      }

      if (this.followingTarget) {
        this.walkTowardsTarget();
      } else {
        this.randomWalk();
      }
    // } 
    super.draw();
  }
}