import { Position, Velocity } from "../interfaces/interfaces";
import { CanvasContext } from "./CanvasContext";

export class Player {
  position: Position;
  velocity: Velocity;
  height: number;

  canvasContext = CanvasContext.getInstance();
  canvas = this.canvasContext.canvas;
  c = this.canvasContext.c;
  gravity = this.canvasContext.gravity;

  constructor(position: Position) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.height = 100;
  }

  draw() {
    if (this.c) {
      this.c.fillStyle = "red";
      this.c.fillRect(this.position.x, this.position.y, 100, this.height);
    }
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (
      this.canvas &&
      this.position.y + this.height + this.velocity.y < this.canvas.height
    ) {
      this.velocity.y += this.gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}
