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

export const fruits = GameState.fruits;
export const players = GameState.players;

// Tipos de fruta
export const fruitTypes = [
  { radius: 21, renderScale: 1.40 },
  { radius: 27, renderScale: 1.42 },
  { radius: 34, renderScale: 1.50 },
  { radius: 43, renderScale: 1.42 }
];

export const SPAWN_MAX_INDEX = 3;

// Random fruta
function randomFruitType() {
  return Math.floor(Math.random() * (SPAWN_MAX_INDEX + 1));
}

// 🔥 COLAS DE PRÓXIMAS FRUTAS (export correcto)
export const nextFruits = GameState.nextFruits;

// Inicializar colas si están vacías
if (nextFruits[0].length === 0) {
  nextFruits[0].push(randomFruitType(), randomFruitType(), randomFruitType());
}
if (nextFruits[1].length === 0) {
  nextFruits[1].push(randomFruitType(), randomFruitType(), randomFruitType());
}

// Spawn fruta
export function spawnFruit(playerIndex) {
  const player = players[playerIndex];
  if (!player) return;

  const typeIndex = nextFruits[playerIndex].shift();
  const info = fruitTypes[typeIndex];

  const fruit = new Fruit(player.x, 80, typeIndex, info.radius);
  fruits.push(fruit);

  // Añadir nueva fruta
  nextFruits[playerIndex].push(randomFruitType());

  // Forzar reactividad
  GameState.nextFruits = [
    [...nextFruits[0]],
    [...nextFruits[1]]
  ];
}

// Físicas
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

  for (const f of fruits) updateRotation(f);
}
