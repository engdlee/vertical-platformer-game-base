import {
  IAnimations,
  IObject,
  Position,
  Velocity,
} from "../interfaces/interfaces";
import { collision, platformcollision } from "../utils";
import { CanvasContext } from "./CanvasContext";
import { CollisionBlock } from "./CollisionBlock";
import { Sprite } from "./Sprite";

export class Player extends Sprite {
  position: Position;
  velocity: Velocity;
  collisionBlocks: CollisionBlock[];
  platformCollisionBlocks: CollisionBlock[];
  hitbox: IObject;
  animations: IAnimations;
  lastDirection: string;
  camerabox: IObject;

  canvasContext = CanvasContext.getInstance();
  canvas = this.canvasContext.canvas;
  c = this.canvasContext.c;
  gravity = this.canvasContext.gravity;

  constructor(
    position: Position,
    collisionBlocks: CollisionBlock[],
    platformCollisionBlocks: CollisionBlock[],
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
    this.platformCollisionBlocks = platformCollisionBlocks;
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

    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  switchSprite(key: string) {
    if (
      this.image ===
        this.animations[key as keyof typeof this.animations].image ||
      !this.loaded
    ) {
      return;
    }
    this.currentFrame = 0;
    if (this.animations[key as keyof typeof this.animations].image) {
      this.image = this.animations[key as keyof typeof this.animations].image;
      this.frameBuffer =
        this.animations[key as keyof typeof this.animations].frameBuffer;
      this.frameRate =
        this.animations[key as keyof typeof this.animations].frameRate;
    }
  }

  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - 50,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }

  checkForHorizontalCanvasCollision() {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0;
    }
  }
  shouldPanCameraToTheLeft(
    canvas: HTMLCanvasElement,
    camera: { position: Position }
  ) {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
    const scaledDownCanvasWidth = canvas.width / 4;

    if (cameraboxRightSide >= 576) {
      return;
    }

    if (
      cameraboxRightSide >=
      scaledDownCanvasWidth + Math.abs(camera.position.x)
    ) {
      camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight(camera: { position: Position }) {
    if (this.camerabox.position.x <= 0) {
      return;
    }

    if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
      camera.position.x -= this.velocity.x;
    }
  }

  update() {
    this.updateFrames();
    this.updateHitbox();

    this.updateCamerabox();

    //for debugging
    if (this.c) {
      // draws the camera
      this.c.fillStyle = "rgba(0, 0, 255, 0.2)";
      this.c.fillRect(
        this.camerabox.position.x,
        this.camerabox.position.y,
        this.camerabox.width,
        this.camerabox.height
      );

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

    // platform collision block
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];
      if (platformcollision(this.hitbox, platformCollisionBlock)) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
