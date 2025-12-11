// =====================================================
// GAME STATE + OBSERVABLE WRAPPER
// =====================================================

import { makeObservableState } from "./observableState.js";
import Fruit from "./Fruit.js";
import { fruitTypes } from "./logic.js";

const baseState = {
  fruits: [],
  players: [
    {
      x: 150,
      y: 120,
      sprite: "manzana.png",
      left: false,
      right: false,
      keyLeft: ["a", "A"],
      keyRight: ["d", "D"],
      keyDrop: " "
    },
    {
      x: 350,
      y: 10,
      sprite: "platano.png",
      left: false,
      right: false,
      keyLeft: ["ArrowLeft"],
      keyRight: ["ArrowRight"],
      keyDrop: "ArrowDown"
    }
  ],

  nextFruits: [[], []],

  width: 600,
  height: 600,

  // NUEVO: flag de fin de partida (solo lectura para la UI)
  gameOver: false
};

export const GameState = makeObservableState(baseState);

export const GameConfig = {
  playerSpeed: 5,
  playerPadding: 25
};

export function getGameStateSnapshot() {
  return {
    width: GameState.width,
    height: GameState.height,

    fruits: GameState.fruits.map(f => ({
      x: f.x,
      y: f.y,
      vx: f.vx,
      vy: f.vy,
      type: f.type,
      radius: f.radius,
      mass: f.mass,
      sleeping: f.sleeping,
      sleepCounter: f.sleepCounter,
      rotation: f.rotation
    })),

    players: GameState.players.map(p => ({
      x: p.x,
      y: p.y
    })),

    nextFruits: [
      [...GameState.nextFruits[0]],
      [...GameState.nextFruits[1]]
    ]
  };
}


// =====================================================
//  RESTAURAR PARTIDA GUARDADA
// =====================================================

export function restoreSavedState(saved) {
  if (!saved) return;

  // Restaurar frutas reales con sus imágenes
  GameState.fruits = saved.fruits.map(f => {
    const info = fruitTypes[f.type];
    const fruit = new Fruit(f.x, f.y, f.type, info.radius, info.color);

    fruit.vx = f.vx;
    fruit.vy = f.vy;
    fruit.sleeping = f.sleeping;
    fruit.sleepCounter = f.sleepCounter;
    fruit.rotation = f.rotation;

    return fruit;
  });

  // Restaurar jugadores
  GameState.players[0].x = saved.players[0].x;
  GameState.players[1].x = saved.players[1].x;

  // Restaurar próxima fruta
  GameState.nextFruits = [
    [...saved.nextFruits[0]],
    [...saved.nextFruits[1]]
  ];

  // Medidas del canvas
  GameState.width = saved.width;
  GameState.height = saved.height;

  // Reset Game Over siempre al cargar partida
  GameState.gameOver = false;
}
