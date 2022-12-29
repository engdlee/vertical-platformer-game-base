import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("#app");
const c = canvas?.getContext("2d");

if (canvas) {
  canvas.width = 1024;
  canvas.height = 576;
}

if (c && canvas) {
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);
}
