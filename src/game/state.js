import { makeObservableState } from "./observableState.js";
import Fruit from "./Fruit.js";
import { fruitTypes } from "./logic.js";

const baseState = {
  fruits: [],

  // 🔑 CLAVE DEL SISTEMA
  playerCount: 2, // 1 o 2

  players: [
    {
      x: 150,
      y: 120,
      sprite: "manzana.png",
      keyLeft: ["a", "A"],
      keyRight: ["d", "D"],
      keyDrop: " "
    },
    {
      x: 350,
      y: 120,
      sprite: "platano.png",
      keyLeft: ["ArrowLeft"],
      keyRight: ["ArrowRight"],
      keyDrop: "ArrowDown"
    }
  ],

  nextFruits: [[], []],
  width: 600,
  height: 600,
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
    playerCount: GameState.playerCount,

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

// ============================
// RESTAURAR PARTIDA
// ============================
export function restoreSavedState(saved) {
  if (!saved) return;

  GameState.playerCount = saved.playerCount ?? 2;

  GameState.fruits = saved.fruits.map(f => {
    const info = fruitTypes[f.type];
    const fruit = new Fruit(f.x, f.y, f.type, info.radius);
    fruit.vx = f.vx;
    fruit.vy = f.vy;
    fruit.sleeping = f.sleeping;
    fruit.rotation = f.rotation;
    return fruit;
  });

  GameState.players[0].x = saved.players[0].x;
  if (GameState.playerCount === 2 && saved.players[1]) {
    GameState.players[1].x = saved.players[1].x;
  }

  GameState.nextFruits = [
    [...saved.nextFruits[0]],
    [...(saved.nextFruits[1] || [])]
  ];

  GameState.gameOver = false;
}
