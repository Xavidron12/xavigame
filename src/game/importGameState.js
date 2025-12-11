// =====================================================
//    IMPORTAR ESTADO DEL JUEGO → Cargar desde Supabase
// =====================================================

import { GameState } from "./state.js";
import Fruit from "./Fruit.js";
import { nextFruits, fruits, players } from "./logic.js";

export function importGameState(saved) {
  if (!saved) return;

  // Limpiar frutas
  GameState.fruits.length = 0;
  fruits.length = 0;

  // Restaurar frutas
  saved.fruits.forEach(f => {
    const nf = new Fruit(f.x, f.y, f.type, f.radius);

    // Dejamos las posiciones, pero las "congelamos"
    nf.vx = 0;
    nf.vy = 0;
    nf.rotation = f.rotation || 0;
    nf.mass = f.mass;
    nf.sleeping = true;
    nf.sleepCounter = 999;

    fruits.push(nf);
    GameState.fruits.push(nf);
  });

  // Restaurar jugadores
  players[0].x = saved.players[0].x;
  players[0].y = saved.players[0].y;
  players[1].x = saved.players[1].x;
  players[1].y = saved.players[1].y;

  // Restaurar próximas frutas
  nextFruits[0].length = 0;
  nextFruits[1].length = 0;

  saved.nextFruits[0].forEach(n => nextFruits[0].push(n));
  saved.nextFruits[1].forEach(n => nextFruits[1].push(n));

  GameState.nextFruits = [
    [...nextFruits[0]],
    [...nextFruits[1]],
  ];

  GameState.gameOver = false;

  console.log("✅ Partida cargada correctamente.");
}
