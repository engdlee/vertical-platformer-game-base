import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#app");
const c = canvas?.getContext("2d");

if (canvas) {
  canvas.width = 1024;
  canvas.height = 576;
}

const gravity = 0.5;
interface Position {
  x: number;
  y: number;
}
interface Velocity extends Position {}
class Player {
  position: Position;
  velocity: Velocity;
  height: number;
  constructor(position: Position) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.height = 100;
  }

  draw() {
    if (c) {
      c.fillStyle = "red";
      c.fillRect(this.position.x, this.position.y, 100, this.height);
    }
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (
      canvas &&
      this.position.y + this.height + this.velocity.y < canvas.height
    ) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
    }
  }
}

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

function animate() {
  window.requestAnimationFrame(animate);
  if (c && canvas) {
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

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
