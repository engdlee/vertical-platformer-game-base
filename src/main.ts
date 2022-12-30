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
        new CollisionBlock({
          x: x * 16,
          y: y * 16,
        })
      );
    }
  });
});

const player = new Player({ x: 0, y: 0 });
const player2 = new Player({ x: 0, y: 0 });

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

function animate() {
  window.requestAnimationFrame(animate);
  if (c && canvas) {
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.save();
    c.scale(4, 4);
    c.translate(0, -background.image.height + scaledCanvas.height);
    background.update();
    collisionBlocks.forEach((collisionBlock) => {
      collisionBlock.update();
    });
    platformCollisionBlocks.forEach((block) => {
      block.update();
    });
    c.restore();

    player.update();
    player.velocity.x = 0;

    if (keys.d.pressed) {
      player.velocity.x = 5;
    } else if (keys.a.pressed) {
      player.velocity.x = -5;
    }
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
      player.velocity.y = -15;
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
