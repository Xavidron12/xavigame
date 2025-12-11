import { players, spawnFruit, nextFruits } from "./logic.js";
import { drawNextFruits } from "../render/render.js";
import { renderGame } from "../render/system.js";
import { InputState } from "./input.js";
import { GameState } from "./state.js";
import { GameEngine } from "./engine.js";
import { subscribe } from "./observableState.js";

let started = false;
let cancelLoop = false;

// Para asegurar que NO se disparan dos frutas muy juntas por cualquier cosa rara
const lastDropTime = [0, 0];   // [p1, p2]
const MIN_DROP_INTERVAL = 80;  // ms

// =====================================================
//  RESET INPUTS
// =====================================================
function resetInputs() {
  InputState.p1.left = false;
  InputState.p1.right = false;
  InputState.p1.drop = false;
  InputState.p1.dropLock = false;

  InputState.p2.left = false;
  InputState.p2.right = false;
  InputState.p2.drop = false;
  InputState.p2.dropLock = false;
}

// =====================================================
//  INPUT HANDLERS (ANTI DOBLE DROP)
// =====================================================
function handleKeyDown(e) {
  const now = performance.now();

  // ----- PLAYER 1 -----
  if (players[0].keyLeft.includes(e.key)) InputState.p1.left = true;
  if (players[0].keyRight.includes(e.key)) InputState.p1.right = true;

  if (e.key === players[0].keyDrop) {
    const elapsed = now - lastDropTime[0];

    if (!InputState.p1.dropLock && elapsed > MIN_DROP_INTERVAL) {
      InputState.p1.drop = true;
      InputState.p1.dropLock = true;
      lastDropTime[0] = now;
      spawnFruit(0); // LANZAR SOLO 1 VEZ
    }
  }

  // ----- PLAYER 2 -----
  if (players[1].keyLeft.includes(e.key)) InputState.p2.left = true;
  if (players[1].keyRight.includes(e.key)) InputState.p2.right = true;

  if (e.key === players[1].keyDrop) {
    const elapsed = now - lastDropTime[1];

    if (!InputState.p2.dropLock && elapsed > MIN_DROP_INTERVAL) {
      InputState.p2.drop = true;
      InputState.p2.dropLock = true;
      lastDropTime[1] = now;
      spawnFruit(1); // LANZAR SOLO 1 VEZ
    }
  }
}

function handleKeyUp(e) {
  // ----- PLAYER 1 -----
  if (players[0].keyLeft.includes(e.key)) InputState.p1.left = false;
  if (players[0].keyRight.includes(e.key)) InputState.p1.right = false;

  if (e.key === players[0].keyDrop) {
    InputState.p1.drop = false;
    InputState.p1.dropLock = false; // 🔓 desbloquear lanzamiento
  }

  // ----- PLAYER 2 -----
  if (players[1].keyLeft.includes(e.key)) InputState.p2.left = false;
  if (players[1].keyRight.includes(e.key)) InputState.p2.right = false;

  if (e.key === players[1].keyDrop) {
    InputState.p2.drop = false;
    InputState.p2.dropLock = false; // 🔓 desbloquear lanzamiento
  }
}

// =====================================================
//  GAME LOOP
// =====================================================
function startLoop(ctx, canvas) {
  cancelLoop = false;
  let last = performance.now();

  function loop(t) {
    if (cancelLoop) return;

    const dtMs = Math.min(32, t - last);
    last = t;
    const dt = dtMs / 16.6667;

    GameEngine.update(dt);
    renderGame(ctx, canvas.width, canvas.height, GameState);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

export function stopGameLoop() {
  cancelLoop = true;
}

// =====================================================
//  START GAME
// =====================================================
export function startGame() {
  if (started) return;     // ❗ evita duplicar listeners y loops
  started = true;

  resetInputs();

  const comp = document.querySelector("fruit-game");
  const canvas = comp?.shadowRoot?.querySelector("#gameCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  GameState.width = canvas.width;
  GameState.height = canvas.height;

  // Previews iniciales
  drawNextFruits("nextCanvas1", nextFruits[0]);
  drawNextFruits("nextCanvas2", nextFruits[1]);

  // Suscripción (una sola vez)
  subscribe("nextFruits", (value) => {
    drawNextFruits("nextCanvas1", value[0]);
    drawNextFruits("nextCanvas2", value[1]);
  });

  // INPUT seguro
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  // Iniciar loop
  startLoop(ctx, canvas);
}
