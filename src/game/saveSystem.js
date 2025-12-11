// src/game/saveSystem.js
import { GameState } from "./state.js";
import { fruits, nextFruits, players } from "./logic.js";

export function resetGame() {
  // Vaciar frutas actuales
  GameState.fruits.length = 0;
  fruits.length = 0;

  // Reposicionar jugadores
  players[0].x = 150;
  players[1].x = 350;

  // Reiniciar próximas frutas
  nextFruits[0].length = 0;
  nextFruits[1].length = 0;

  nextFruits[0].push(0, 1, 2);
  nextFruits[1].push(0, 1, 2);

  GameState.nextFruits = [
    [...nextFruits[0]],
    [...nextFruits[1]]
  ];

  // Reiniciar estado de game over
  GameState.gameOver = false;

  console.log("🔄 Juego reiniciado correctamente");
}
