import { BaseElement } from "./Base";

const drawCicle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

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
  constructor (ctx: CanvasRenderingContext2D, walkingDirection: number) {
    super(ctx);
    this.walkingDirection = walkingDirection;
  }

  updateTrail() {
    if (this.trail.length > 99) {
      const [,...trail] = this.trail;
      this.trail = trail;
    }
    this.trail = [...this.trail, [this.x, this.y]];
  }

  nextPoint() {
    const thita = (Math.PI * this.walkingDirection) / 180;
    this.x = this.x + (Math.cos(thita) * this.distance);
    this.y = this.y + (Math.sin(thita) * this.distance);
  }

  walk(OtherAnts: WalkingAnt[]) {
    this.walkingDirection = this.walkingDirection + ((Math.random() - 0.5) * 30);
    const x = this.x;
    const y = this.y;
    let newDirection = 1;
    this.nextPoint();
    while(
      (// wall ditection
      this.x < this.distance
      || this.x > (this.ctx.canvas.width - this.distance)
      || this.y < this.distance
      || this.y > (this.ctx.canvas.height - this.distance)
      // Intersect with nearby ants
      || OtherAnts.find(ant => (this.radius * 3) > antDistance(this, ant))
      )
      && newDirection < 10
    ) {
      newDirection++;
      this.x = x;
      this.y = y;
      this.walkingDirection = this.walkingDirection - 5;
      this.nextPoint();
    }

    this.steps++;
    if (this.steps === this.trailStep) {
      this.updateTrail();
      this.steps = 0;
    }
    this.draw(this.radius);
  }
}

const antDistance = (antA: Ant, antB: Ant) => {
  let xDistance = antB.x - antA.x;
  let yDistance = antB.y - antA.y;
  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
}

export class AntsHome {
  x: number = 0;
  y: number = 0;
  ctx: CanvasRenderingContext2D;
  ants: WalkingAnt[];
  size: number;
  constructor(ctx: CanvasRenderingContext2D, totalAnts: number, size = 100) {
    this.ctx = ctx;
    this.x = this.ctx.canvas.width/2;
    this.y = this.ctx.canvas.height/2;
    this.size = size;

    this.ants = [...Array(totalAnts)].map((_, i, all) => {
      const direction = ((360 / all.length) * i);
      const ant = new WalkingAnt(this.ctx, direction)
      const thita = (Math.PI * direction) / 180;
      ant.x = this.x + (Math.cos(thita) * size);
      ant.y = this.y + (Math.sin(thita) * size);
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
      ant.walk(i ? this.ants.slice(0, i - 1) : []);
    });
  
    var gradient = this.ctx.createRadialGradient(this.x, this.y, this.size / 2, this.x, this.y, this.size / 0.8);
    gradient.addColorStop(0, '#000000FF');
    gradient.addColorStop(1, '#00000000');
    this.ctx.arc(this.x, this.y, this.size * 1.5, 0, 2 * Math.PI);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }
}