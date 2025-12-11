import Fruit from "./Fruit.js";
import { collisionsAndFusion } from "../core/collision.js";
import { GameState, GameConfig } from "./state.js";
import { updateRotation } from "../core/rotation.js";
import {
  CONFIG,
  applyGravity,
  applyMovement,
  applyFriction,
  applyBoundaries,
  checkSleepState
} from "../core/physics.js";
import { InputState } from "./input.js";

// Estado real del juego: usamos las listas de GameState
export const fruits = GameState.fruits;
export const players = GameState.players;

// RADIOS x1.50 y renderScale ajustado
export const fruitTypes = [
  { radius: Math.round(14 * 1.50), renderScale: 1.40 },
  { radius: Math.round(18 * 1.50), renderScale: 1.42 },
  { radius: Math.round(23 * 1.50), renderScale: 1.50 },
  { radius: Math.round(29 * 1.50), renderScale: 1.42 },
  { radius: Math.round(36 * 1.50), renderScale: 1.40 },
  { radius: Math.round(47 * 1.50), renderScale: 1.48 },
  { radius: Math.round(61 * 1.50), renderScale: 1.30 },
  { radius: Math.round(77 * 1.50), renderScale: 1.42 },
  { radius: Math.round(99 * 1.50), renderScale: 1.30 },
  { radius: Math.round(126 * 1.50), renderScale: 1.80 }
];

export const SPAWN_MAX_INDEX = 3;

function randomFruitType() {
  return Math.floor(Math.random() * (SPAWN_MAX_INDEX + 1));
}

// Colas de próximas frutas
export const nextFruits = GameState.nextFruits;

// Inicializamos igual que antes
nextFruits[0].push(randomFruitType(), randomFruitType(), randomFruitType());
nextFruits[1].push(randomFruitType(), randomFruitType(), randomFruitType());

// Spawn de fruta
export function spawnFruit(playerIndex) {
  const player = players[playerIndex];
  if (!player) return;

  const typeIndex = nextFruits[playerIndex].shift();
  const info = fruitTypes[typeIndex];

  const fruit = new Fruit(player.x, 80, typeIndex, info.radius, info.color);
  fruits.push(fruit);

  // Nueva fruta
  nextFruits[playerIndex].push(randomFruitType());

  // Clamp
  nextFruits[playerIndex] = nextFruits[playerIndex].map(n =>
    Math.min(n, SPAWN_MAX_INDEX)
  );

  // ⚡ IMPORTANTE: reemitimos el array para activar observadores
  GameState.nextFruits = [...GameState.nextFruits];
}

// Movimiento de jugadores
export function updatePlayers(width) {
  const speed = GameConfig.playerSpeed;

  let p1x = players[0].x;
  let p2x = players[1].x;

  if (InputState.p1.left) p1x -= speed;
  if (InputState.p1.right) p1x += speed;

  if (InputState.p2.left) p2x -= speed;
  if (InputState.p2.right) p2x += speed;

  p1x = Math.max(GameConfig.playerPadding, Math.min(width - GameConfig.playerPadding, p1x));
  p2x = Math.max(GameConfig.playerPadding, Math.min(width - GameConfig.playerPadding, p2x));

  players[0].x = p1x;
  players[1].x = p2x;
}

// Paso de físicas + colisiones
export function step(dt, width, height) {
  const h = dt / CONFIG.subSteps;

  for (let s = 0; s < CONFIG.subSteps; s++) {
    for (const f of fruits) {
      if (f.sleeping) continue;

      applyGravity(f, h, height);
      applyMovement(f, h);
      applyBoundaries(f, width, height);
      applyFriction(f);
      checkSleepState(f, height);
    }

    collisionsAndFusion(fruits, fruitTypes);
  }

  // Rotación una vez por frame
  for (const f of fruits) {
    updateRotation(f);
  }
}
