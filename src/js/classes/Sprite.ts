import { ISprite, Position } from "../interfaces/interfaces";
import { CanvasContext } from "./CanvasContext";

export class Sprite {
  position: Position;
  image: HTMLImageElement;

  canvasContext = CanvasContext.getInstance();
  canvas = this.canvasContext.canvas;
  c = this.canvasContext.c;

  constructor({ position, imageSrc }: ISprite) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw() {
    if (!this.image) {
      return;
    }
    if (this.c) {
      this.c.drawImage(this.image, this.position.x, this.position.y);
    }
  }

  update() {
    this.draw();
  }
}
