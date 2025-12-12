// =====================================================
//  STARTGAME.JS — Control de inputs y loop principal
// =====================================================

import { players, spawnFruit, nextFruits } from "./logic.js";
import { drawNextFruits } from "../render/render.js";
import { renderGame } from "../render/system.js";
import { InputState } from "./input.js";
import { GameState } from "./state.js";
import { GameEngine } from "./engine.js";
import { subscribe } from "./observableState.js";

import { fromEvent } from "rxjs";

let started = false;
let cancelLoop = false;

let keySubsAttached = false;
let keyDownSub = null;
let keyUpSub = null;

// Anti doble drop
const lastDropTime = [0, 0];

// Cooldown de lanzamiento (1 segundo)
const MIN_DROP_INTERVAL = 1000;

// ===============================================
// RESET DE INPUTS
// ===============================================
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

// ===============================================
// HANDLERS DE TECLADO
// ===============================================
function handleKeyDown(e) {
  if (GameState.gameOver) return;

  const now = performance.now();

  // ---------------- PLAYER 1 ----------------
  if (players[0].keyLeft.includes(e.key)) InputState.p1.left = true;
  if (players[0].keyRight.includes(e.key)) InputState.p1.right = true;

  if (e.key === players[0].keyDrop) {
    const elapsed = now - lastDropTime[0];
    if (!InputState.p1.dropLock && elapsed > MIN_DROP_INTERVAL) {
      InputState.p1.drop = true;
      InputState.p1.dropLock = true;
      lastDropTime[0] = now;
      spawnFruit(0);
    }
  }

  // ---------------- PLAYER 2 (SOLO SI EXISTE) ----------------
  if (GameState.playerCount === 2) {
    if (players[1].keyLeft.includes(e.key)) InputState.p2.left = true;
    if (players[1].keyRight.includes(e.key)) InputState.p2.right = true;

    if (e.key === players[1].keyDrop) {
      const elapsed = now - lastDropTime[1];
      if (!InputState.p2.dropLock && elapsed > MIN_DROP_INTERVAL) {
        InputState.p2.drop = true;
        InputState.p2.dropLock = true;
        lastDropTime[1] = now;
        spawnFruit(1);
      }
    }
  }
}

function handleKeyUp(e) {
  if (GameState.gameOver) return;

  // PLAYER 1
  if (players[0].keyLeft.includes(e.key)) InputState.p1.left = false;
  if (players[0].keyRight.includes(e.key)) InputState.p1.right = false;

  if (e.key === players[0].keyDrop) {
    InputState.p1.drop = false;
    InputState.p1.dropLock = false;
  }

  // PLAYER 2 (SOLO SI EXISTE)
  if (GameState.playerCount === 2) {
    if (players[1].keyLeft.includes(e.key)) InputState.p2.left = false;
    if (players[1].keyRight.includes(e.key)) InputState.p2.right = false;

    if (e.key === players[1].keyDrop) {
      InputState.p2.drop = false;
      InputState.p2.dropLock = false;
    }
  }
}

// ===============================================
// LOOP PRINCIPAL
// ===============================================
function startLoop(ctx, canvas) {
  cancelLoop = false;
  let last = performance.now();

  function loop(t) {
    if (cancelLoop) return;

    const dt = Math.min(32, t - last) / 16.6667;
    last = t;

    GameEngine.update(dt);

    renderGame(ctx, canvas.width, canvas.height, GameState);

    // SINCRONIZAR AVATARES HTML
    const p1Avatar = document.querySelector("#player1-avatar");
    if (p1Avatar) p1Avatar.style.left = `${GameState.players[0].x}px`;

    const p2Avatar = document.querySelector("#player2-avatar");
    if (p2Avatar) {
      if (GameState.playerCount === 2) {
        p2Avatar.style.display = "block";
        p2Avatar.style.left = `${GameState.players[1].x}px`;
      } else {
        p2Avatar.style.display = "none";
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

// ===============================================
// PUBLIC API — INICIAR EL JUEGO
// ===============================================
export function startGame() {
  if (started) return;
  started = true;

  resetInputs();

  const comp = document.querySelector("fruit-game");
  const canvas = comp?.shadowRoot?.querySelector("#gameCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  GameState.width = canvas.width;
  GameState.height = canvas.height;

  // PREVIEWS INICIALES
  drawNextFruits("nextCanvas1", nextFruits[0]);

  if (GameState.playerCount === 2) {
    drawNextFruits("nextCanvas2", nextFruits[1]);
  } else {
    const c2 = document.querySelector("#nextCanvas2");
    if (c2) c2.getContext("2d").clearRect(0, 0, c2.width, c2.height);
  }

  // Reactividad previews (GameState.nextFruits → notify("nextFruits"))
  subscribe("nextFruits", (value) => {
    drawNextFruits("nextCanvas1", value[0]);
    if (GameState.playerCount === 2) drawNextFruits("nextCanvas2", value[1]);
  });

  // RxJS: listeners de teclado
  if (!keySubsAttached) {
    keySubsAttached = true;
    keyDownSub = fromEvent(document, "keydown").subscribe(handleKeyDown);
    keyUpSub = fromEvent(document, "keyup").subscribe(handleKeyUp);
  }

  startLoop(ctx, canvas);
}
