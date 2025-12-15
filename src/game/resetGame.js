import { GameState } from "./state.js";
import { fruits, players } from "./logic.js";

export function resetGame() {
  // Vaciar frutas
  GameState.fruits.length = 0;
  fruits.length = 0;

  // Reset jugadores
  players[0].x = 150;
  players[0].y = 50;

  players[1].x = 350;
  players[1].y = 50;

  // Reset proximas frutas
  GameState.nextFruits = [
    [0, 1, 2],
    [0, 1, 2]
  ];

  GameState.gameOver = false;

  console.log(" Juego reiniciado correctamente");
}
