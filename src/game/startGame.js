import { players, spawnFruit, nextFruits } from "./logic.js";
import { drawNextFruits } from "../render/render.js";
import { renderGame } from "../render/system.js";
import { InputState } from "./input.js";
import { GameState } from "./state.js";
import { GameEngine } from "./engine.js";
import { subscribe } from "./observableState.js";

let started = false;
let cancelLoop = false;

const lastDrop = [0, 0];
const MIN_MS = 90;

function handleKeyDown(e) {
  const now = performance.now();

  // PLAYER 1
  if (players[0].keyLeft.includes(e.key)) InputState.p1.left = true;
  if (players[0].keyRight.includes(e.key)) InputState.p1.right = true;

  if (e.key === players[0].keyDrop) {
    if (now - lastDrop[0] > MIN_MS) {
      lastDrop[0] = now;
      spawnFruit(0);
    }
  }

  // PLAYER 2
  if (players[1].keyLeft.includes(e.key)) InputState.p2.left = true;
  if (players[1].keyRight.includes(e.key)) InputState.p2.right = true;

  if (e.key === players[1].keyDrop) {
    if (now - lastDrop[1] > MIN_MS) {
      lastDrop[1] = now;
      spawnFruit(1);
    }
  }
}

function handleKeyUp(e) {
  if (players[0].keyLeft.includes(e.key)) InputState.p1.left = false;
  if (players[0].keyRight.includes(e.key)) InputState.p1.right = false;

  if (players[1].keyLeft.includes(e.key)) InputState.p2.left = false;
  if (players[1].keyRight.includes(e.key)) InputState.p2.right = false;
}

function startLoop(ctx, canvas) {
  cancelLoop = false;
  let last = performance.now();

  function loop(t) {
    if (cancelLoop) return;

    const dt = Math.min(32, t - last) / 16.6667;
    last = t;

    GameEngine.update(dt);
    renderGame(ctx, canvas.width, canvas.height, GameState);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

export function startGame() {
  if (started) return;
  started = true;

  const comp = document.querySelector("fruit-game");
  const canvas = comp.shadowRoot.querySelector("#gameCanvas");
  const ctx = canvas.getContext("2d");

  GameState.width = canvas.width;
  GameState.height = canvas.height;

  drawNextFruits("nextCanvas1", nextFruits[0]);
  drawNextFruits("nextCanvas2", nextFruits[1]);

  subscribe("nextFruits", (value) => {
    drawNextFruits("nextCanvas1", value[0]);
    drawNextFruits("nextCanvas2", value[1]);
  });

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  startLoop(ctx, canvas);
}
