// =====================================================
//  RESET GAME — Volver a estado inicial limpio
// =====================================================

import { GameState } from "./state.js";
import { fruits, nextFruits, players } from "./logic.js";

export function resetGame() {
  // 1) Vaciar frutas (referencias compartidas)
  fruits.length = 0;
  GameState.fruits.length = 0;

  // 2) Reposicionar jugadores
  players[0].x = 150;
  players[0].y = 50;

  players[1].x = 350;
  players[1].y = 50;

  // 3) Reiniciar próximas frutas (cola simple 0,1,2)
  nextFruits[0].length = 0;
  nextFruits[1].length = 0;

  nextFruits[0].push(0, 1, 2);
  nextFruits[1].push(0, 1, 2);

  GameState.nextFruits = [
    [...nextFruits[0]],
    [...nextFruits[1]],
  ];

  // 4) Quitar game over
  GameState.gameOver = false;

  console.log("🔄 Juego reiniciado correctamente");
}
