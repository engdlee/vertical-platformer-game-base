import { Position, Velocity } from "../interfaces/interfaces";
import { collision } from "../utils";
import { CanvasContext } from "./CanvasContext";
import { CollisionBlock } from "./CollisionBlock";

export class Player {
  position: Position;
  velocity: Velocity;
  width: number;
  height: number;
  collisionBlocks: CollisionBlock[];

  canvasContext = CanvasContext.getInstance();
  canvas = this.canvasContext.canvas;
  c = this.canvasContext.c;
  gravity = this.canvasContext.gravity;

  constructor(position: Position, collisionBlocks: CollisionBlock[]) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 25;
    this.height = 25;
    this.collisionBlocks = collisionBlocks;
  }

  draw() {
    if (this.c) {
      this.c.fillStyle = "red";
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
    this.position.x += this.velocity.x;
    this.checkForHorizontalCollisions(); // before gravity
    this.applyGravity();
    this.checkForVerticalCollisions();
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (collision(this, collisionBlock)) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.position.x = collisionBlock.position.x - this.width - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width + 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.position.y += this.velocity.y;
    this.velocity.y += this.gravity;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (collision(this, collisionBlock)) {
        console.log("we are colliding");
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - this.height - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height + 0.01;
          break;
        }
      }
    }
  }
}
