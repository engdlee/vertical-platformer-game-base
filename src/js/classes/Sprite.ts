import { ISprite, Position } from "../interfaces/interfaces";
import { CanvasContext } from "./CanvasContext";

export class Sprite {
  position: Position;
  image: HTMLImageElement | undefined;
  width: number = 0;
  height: number = 0;
  frameRate: number;
  currentFrame: number;
  frameBuffer: number;
  elapsedFrames: number;
  scale: number;
  loaded: boolean;

  canvasContext = CanvasContext.getInstance();
  canvas = this.canvasContext.canvas;
  c = this.canvasContext.c;

  constructor({
    position,
    imageSrc,
    frameRate = 1,
    frameBuffer = 3,
    scale = 1,
  }: ISprite) {
    this.position = position;
    this.scale = scale;
    this.loaded = false;
    this.image = new Image();
    this.image.onload = () => {
      if (this.image) {
        this.width = (this.image.width / this.frameRate) * this.scale;
        this.height = this.image.height * this.scale;
        this.loaded = true;
      }
    };
    this.image.src = imageSrc;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
  }

  draw() {
    if (!this.image) {
      return;
    }

    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };

    if (this.c) {
      this.c.drawImage(
        this.image,
        cropbox.position.x,
        cropbox.position.y,
        cropbox.width,
        cropbox.height,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update() {
    this.draw();
    this.updateFrames();
  }

  updateFrames() {
    this.elapsedFrames++;
    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
}
