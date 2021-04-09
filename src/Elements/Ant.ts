import { drawCicle } from "../utils";
import { BaseElement } from "./Base";
import { Food } from "./Food";

export class Ant implements BaseElement {
  x: number = 0;
  y: number = 0;
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  draw(r: number) {
    this.ctx.strokeStyle = '#CC0000';
    this.ctx.fillStyle = '#ff5555';
    drawCicle(this.ctx, this.x, this.y, r);
  };
}

export class WalkingAnt extends Ant {
  walkingDirection: number;
  distance = 3; 
  radius = 1.6;
  trailStep = 5;
  steps = 0;
  trail: [number,number][] = [];
  home: [number,number,number];
  caryingFood?: Food;
  constructor (ctx: CanvasRenderingContext2D, walkingDirection: number, home: [number,number,number]) {
    super(ctx);
    this.walkingDirection = walkingDirection;
    this.home = home;
  }

  updateTrail() {
    if (!this.caryingFood) {
      if (this.steps === 0) {
        this.steps = this.trailStep;
        if (this.trail.length > 99) {
          const [,...trail] = this.trail;
          this.trail = trail;
        }
        this.trail = [...this.trail, [this.x, this.y]];
      }
      this.steps--;
    }
  }

  nextStep() {
    const thita = (Math.PI * this.walkingDirection) / 180;
    this.x = this.x + (Math.cos(thita) * this.distance);
    this.y = this.y + (Math.sin(thita) * this.distance);
  }

  checkWallCollision() {
    // wall ditection
    return this.x < this.distance
    || this.x > (this.ctx.canvas.width - this.distance)
    || this.y < this.distance
    || this.y > (this.ctx.canvas.height - this.distance)
  }

  checkAntsCollision(Ants: WalkingAnt[]) {
    // Other ants collision
    return Ants.find(ant => (this.radius * 3) > antDistance(this, [ant.x, ant.y]))
  }

  randomWalk(currentX: number, currentY: number) {
    const randomDirection = () => {
      this.walkingDirection = this.walkingDirection + ((Math.random() - 0.5) * 30);
    }
    randomDirection();
    this.nextStep();
    while(this.checkWallCollision()) {
      this.x = currentX;
      this.y = currentY;
      this.walkingDirection = this.walkingDirection + ((Math.random() - 0.5) * 30);
      randomDirection();
      this.nextStep();
    }
  }

  trailWalk() {
    let lastTrailPoint = this.trail[this.trail.length - 1];
    if (this.caryingFood && lastTrailPoint) {
      // remove last trail step if ant is on that step
      if (this.trail.length > 0 && this.distance >= antDistance(this, [lastTrailPoint[0], lastTrailPoint[1]])) {
        this.trail.pop();
        lastTrailPoint = this.trail[this.trail.length - 1];
      }
      if (lastTrailPoint) {
        const [x, y] = lastTrailPoint;
        this.walkingDirection = Math.atan2((y - this.y), (x - this.x)) * 180/Math.PI;
        this.nextStep();
      }
    }
  }

  walk(Ants: WalkingAnt[], foods: Food[]) {

    // When ant is at home
    if ((this.radius + this.home[2]) >= antDistance(this, [this.home[0], this.home[1]])) {
      // clear trails
      this.trail = [];
      // drop food
      if (this.caryingFood) {
        this.caryingFood = undefined;
      }
    } 

    // Crary food if ant is not already carying
    if (!this.caryingFood) {
      this.caryingFood = foods.find(f => (f.r + this.radius) >= antDistance(this, [f.x, f.y]));
    }

    // Ant current Position
    const x = this.x;
    const y = this.y;

    if (this.caryingFood && this.trail.length > 0) {
      this.trailWalk()
    } else {
      // random walking
      this.randomWalk(x, y);
    }


    if (this.checkAntsCollision(Ants)) {
      // Stop walking if any ant ahead
      this.x = x;
      this.y = y;
    } else {
      // Update trail if ant has any successful step
      this.updateTrail();
    }

    this.draw(this.radius);
  }
}

const antDistance = (antA: Ant, [x, y]: [number, number]) => {
  let xDistance = x - antA.x;
  let yDistance = y - antA.y;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}

export class AntsHome {
  x: number = 0;
  y: number = 0;
  ctx: CanvasRenderingContext2D;
  ants: WalkingAnt[];
  size: number;
  foods: Food[] = [];

  constructor(ctx: CanvasRenderingContext2D, totalAnts: number, size = 100) {
    this.ctx = ctx;
    this.x = this.ctx.canvas.width/2;
    this.y = this.ctx.canvas.height/2;
    this.size = size;

    this.ants = [...Array(totalAnts)].map((_, i, all) => {
      const direction = ((360 / all.length) * i);
      const ant = new WalkingAnt(this.ctx, direction, [this.x, this.y, this.size])
      const thita = (Math.PI * direction) / 180;
      ant.x = this.x + (Math.cos(thita) * (size/2));
      ant.y = this.y + (Math.sin(thita) * (size/2));
      return ant;
    });
  }

  drawTrail() {    
    this.ctx.strokeStyle = 'white';
    this.ctx.fillStyle = 'blue';
    this.ants.forEach((ant, i) => {
      ant.trail.forEach((step) => {
        drawCicle(this.ctx, step[0], step[1], 1);
      })
    });
  }

  escape() {
    this.ants.forEach((ant, i) => {
      ant.walk(i ? this.ants.slice(0, i - 1) : [], this.foods);
    });
  
    var gradient = this.ctx.createRadialGradient(this.x, this.y, this.size / 2, this.x, this.y, this.size / 0.8);
    gradient.addColorStop(0, '#000000FF');
    gradient.addColorStop(1, '#00000000');
    this.ctx.arc(this.x, this.y, this.size * 1.5, 0, 2 * Math.PI);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }
}