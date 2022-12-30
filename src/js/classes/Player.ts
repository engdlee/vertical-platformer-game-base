import {
  IAnimations,
  IObject,
  Position,
  Velocity,
} from "../interfaces/interfaces";
import { collision } from "../utils";
import { CanvasContext } from "./CanvasContext";
import { CollisionBlock } from "./CollisionBlock";
import { Sprite } from "./Sprite";

export class Player extends Sprite {
  position: Position;
  velocity: Velocity;
  collisionBlocks: CollisionBlock[];
  hitbox: IObject;
  animations: IAnimations;
  lastDirection: string;

  canvasContext = CanvasContext.getInstance();
  canvas = this.canvasContext.canvas;
  c = this.canvasContext.c;
  gravity = this.canvasContext.gravity;

  constructor(
    position: Position,
    collisionBlocks: CollisionBlock[],
    imageSrc: string,
    frameRate: number,
    animations: IAnimations,
    scale = 0.5
  ) {
    super({ position, imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };

    this.collisionBlocks = collisionBlocks;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };

    this.animations = animations;
    this.lastDirection = "right";

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key as keyof typeof this.animations]
        .imageSrc as string;

      this.animations[key as keyof typeof this.animations].image = image;
    }
  }

  switchSprite(key: string) {
    if (
      this.image ===
        this.animations[key as keyof typeof this.animations].image ||
      !this.loaded
    ) {
      return;
    }
    if (this.animations[key as keyof typeof this.animations].image) {
      this.image = this.animations[key as keyof typeof this.animations].image;
      this.frameBuffer =
        this.animations[key as keyof typeof this.animations].frameBuffer;
      this.frameRate =
        this.animations[key as keyof typeof this.animations].frameRate;
    }
  }

  update() {
    this.updateFrames();
    this.updateHitbox();

    //for debugging
    if (this.c) {
      // draws the image
      this.c.fillStyle = "rgba(0, 255, 0, 0.2)";
      this.c.fillRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );

      // draws the hitbox
      this.c.fillStyle = "rgba(255, 0, 0, 0.2)";
      this.c.fillRect(
        this.hitbox.position.x,
        this.hitbox.position.y,
        this.hitbox.width,
        this.hitbox.height
      );
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions(); // before gravity
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
  }

  hitboxDimensions = {
    position: {
      x: 35,
      y: 26,
    },
    width: 14,
    height: 27,
  };

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + this.hitboxDimensions.position.x,
        y: this.position.y + this.hitboxDimensions.position.y,
      },
      width: this.hitboxDimensions.width,
      height: this.hitboxDimensions.height,
    };
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (collision(this.hitbox, collisionBlock)) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      if (collision(this.hitbox, collisionBlock)) {
        console.log("we are colliding");
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;

          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }
  }
}
