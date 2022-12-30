import "./style.css";
import { floorCollisions, platformCollisions } from "./js/data/collisions";
import { Player } from "./js/classes/Player";
import { Sprite } from "./js/classes/Sprite";
import { CanvasContext } from "./js/classes/CanvasContext";
import { CollisionBlock } from "./js/classes/CollisionBlock";

const canvasContext = CanvasContext.getInstance();
const canvas = canvasContext.canvas;
const c = canvasContext.c;
const gravity = canvasContext.gravity;

let scaledCanvas = { with: 0, height: 0 };
if (canvas) {
  canvas.width = 1024;
  canvas.height = 576;

  scaledCanvas.with = canvas.width / 4;
  scaledCanvas.height = canvas.height / 4;
}

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks: CollisionBlock[] = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      console.log("draw a block here!");
      collisionBlocks.push(
        new CollisionBlock({
          x: x * 16,
          y: y * 16,
        })
      );
    }
  });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks: CollisionBlock[] = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      console.log("draw a block here!");
      platformCollisionBlocks.push(
        new CollisionBlock(
          {
            x: x * 16,
            y: y * 16,
          },
          4
        )
      );
    }
  });
});

const player = new Player(
  { x: 50, y: 0 },
  collisionBlocks,
  platformCollisionBlocks,
  "./img/warrior/Idle.png",
  8,
  {
    Idle: {
      imageSrc: "./img/warrior/Idle.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    Run: {
      imageSrc: "./img/warrior/Run.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: "./img/warrior/Jump.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: "./img/warrior/Fall.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: "./img/warrior/FallLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: "./img/warrior/RunLeft.png",
      frameRate: 8,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: "./img/warrior/IdleLeft.png",
      frameRate: 8,
      frameBuffer: 7,
    },
    JumpLeft: {
      imageSrc: "./img/warrior/JumpLeft.png",
      frameRate: 2,
      frameBuffer: 3,
    },
  }
);
// const player2 = new Player({ x: 0, y: 0 });

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const camera = {
  position: {
    x: 0,
    y: 0,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  if (c && canvas) {
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.scale(4, 4);
    if (background.image) {
      c.translate(
        camera.position.x,
        -background.image.height + scaledCanvas.height
      );
    }
    background.update();
    collisionBlocks.forEach((collisionBlock) => {
      collisionBlock.update();
    });
    platformCollisionBlocks.forEach((block) => {
      block.update();
    });

    player.checkForHorizontalCanvasCollision();
    player.update();

    player.velocity.x = 0;
    if (keys.d.pressed) {
      player.switchSprite("Run");
      player.velocity.x = 2;
      player.lastDirection = "right";
      player.shouldPanCameraToTheLeft(canvas, camera);
    } else if (keys.a.pressed) {
      player.switchSprite("RunLeft");
      player.velocity.x = -2;
      player.lastDirection = "left";
      player.shouldPanCameraToTheRight(camera);
    } else if (player.velocity.y === 0) {
      if (player.lastDirection === "right") {
        player.switchSprite("Idle");
      } else {
        player.switchSprite("IdleLeft");
      }
    }

    if (player.velocity.y < 0) {
      if (player.lastDirection === "right") {
        player.switchSprite("Jump");
      } else {
        player.switchSprite("JumpLeft");
      }
    } else if (player.velocity.y > 0) {
      if (player.lastDirection === "right") {
        player.switchSprite("Fall");
      } else {
        player.switchSprite("FallLeft");
      }
    }
    console.log(player.velocity.y);

    c.restore();
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      player.velocity.y = -4;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});
