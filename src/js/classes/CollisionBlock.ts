import { Position } from "../interfaces/interfaces";
import { CanvasContext } from "./CanvasContext";

export class CollisionBlock {
  position: Position;
  width: number;
  height: number;

  canvasContext = CanvasContext.getInstance();
  canvas = this.canvasContext.canvas;
  c = this.canvasContext.c;
  gravity = this.canvasContext.gravity;

  constructor(position: Position) {
    this.position = position;
    this.width = 16;
    this.height = 16;
  }

  draw() {
    if (this.c) {
      this.c.fillStyle = "rgba(255,0,0,0.5";
      this.c.fillRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update() {
    this.draw();
  }
}
