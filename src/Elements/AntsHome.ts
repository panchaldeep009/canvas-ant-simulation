import { CircularElement } from "./Base";
import { Position } from '../Math/Position';
import { Ant } from "./Ant";
import { Food } from "./Food";

export class AntsHome extends CircularElement {
  ants: Ant[];
  location: Position;
  radius: number = 100;
  food: Food[] = [];

  public set size(value: number) {
    this.radius = value * 1.5;
  }

  constructor(antCtx: CanvasRenderingContext2D, backgroundCtx: CanvasRenderingContext2D, frogroundCtx: CanvasRenderingContext2D, totalAnts: number, size = 100) {
    super(frogroundCtx);
    this.size = size;
    this.location = new Position();
    this.location.x = this.ctx.canvas.width / 2;
    this.location.y = this.ctx.canvas.height / 2;

    this.ants = [...Array(totalAnts)].map((_, i, all) => {
      const direction = ((360 / all.length) * i);
      const thita = (Math.PI * direction) / 180;
      const ant = new Ant(antCtx, backgroundCtx, this.location)
      ant.location.direction = direction;
      ant.location.x = this.location.x + (Math.cos(thita) * (size/2));
      ant.location.y = this.location.y + (Math.sin(thita) * (size/2));
      return ant;
    });
    this.draw();
  }

  body() {
    const size = this.radius / 1.5;
    const { x, y } = this.location;
    var gradient = this.ctx.createRadialGradient(x, y, size / 2, x, y, size / 0.8);
    gradient.addColorStop(0, '#000000FF');
    gradient.addColorStop(1, '#00000000');
    this.ctx.fillStyle = gradient;
    this.ctx.strokeStyle = 'transparent';
    super.body();
  }

  drawAnts() {
    this.ants.forEach((ant, i) => {
      ant.draw(i ? this.ants.slice(0, i - 1) : [], this.food);
    });
  }
}