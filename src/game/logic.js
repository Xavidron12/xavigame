import Fruit from "./Fruit.js";
import { collisionsAndFusion } from "../core/collision.js";
import { GameState } from "./state.js";
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

// =====================================================
//  TIPOS DE FRUTA (10 niveles, hasta sandía)
// =====================================================
export const fruitTypes = [
  { radius: 21,  renderScale: 1.40 }, // 0 cereza
  { radius: 27,  renderScale: 1.42 }, // 1 fresa
  { radius: 34,  renderScale: 1.50 }, // 2 uva
  { radius: 43,  renderScale: 1.42 }, // 3 limón
  { radius: 55,  renderScale: 1.45 }, // 4 manzana
  { radius: 70,  renderScale: 1.40 }, // 5 naranja
  { radius: 90,  renderScale: 1.35 }, // 6 pera
  { radius: 115, renderScale: 1.35 }, // 7 mango
  { radius: 140, renderScale: 1.30 }, // 8 aguacate
  { radius: 170, renderScale: 1.30 }  // 9 sandía (último nivel)
];

export const SPAWN_MAX_INDEX = 3;

// Fruta aleatoria (solo pequeñas)
function randomFruitType() {
  return Math.floor(Math.random() * (SPAWN_MAX_INDEX + 1));
}

// Próximas frutas (reactivas)
export const nextFruits = GameState.nextFruits;

// Inicializar colas si están vacías
if (nextFruits[0].length === 0)
  nextFruits[0].push(randomFruitType(), randomFruitType(), randomFruitType());

if (nextFruits[1].length === 0)
  nextFruits[1].push(randomFruitType(), randomFruitType(), randomFruitType());

// =====================================================
//  SPAWN DE FRUTA
// =====================================================
export function spawnFruit(playerIndex) {
  const player = players[playerIndex];
  if (!player) return;

  const typeIndex = nextFruits[playerIndex].shift();
  const info = fruitTypes[typeIndex];

  const SAFE_SPAWN_Y = 10;

  // ===================================================
  // 🔴 🔴 🔴 AJUSTA SOLO ESTE VALOR 🔴 🔴 🔴
  // ===================================================
  // SI LA FRUTA CAE A LA DERECHA → MÁS NEGATIVO
  // SI CAE A LA IZQUIERDA → MÁS POSITIVO
  const SPAWN_OFFSET_X = -25;
  // ===================================================

  const fruitX = player.x + SPAWN_OFFSET_X;
  const fruit = new Fruit(fruitX, SAFE_SPAWN_Y, typeIndex, info.radius);
  fruits.push(fruit);

  // Nueva fruta en la cola
  nextFruits[playerIndex].push(randomFruitType());

  // Forzar actualización de previews
  GameState.nextFruits = [
    [...nextFruits[0]],
    [...nextFruits[1]]
  ];
}

// =====================================================
//  FÍSICAS + COLISIONES
// =====================================================
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

  for (const f of fruits) {
    updateRotation(f);
  }
}
