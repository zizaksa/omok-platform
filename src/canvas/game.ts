import { AppCanvas } from "./app-canvas";

const appCanvas = new AppCanvas(800, 600);

document.getElementById('container').appendChild(appCanvas.getView());