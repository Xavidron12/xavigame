// =====================================================
//    IMPORTAR ESTADO DEL JUEGO para cargar desde Supabase
// =====================================================

import { GameState } from "./state.js";
import Fruit from "./Fruit.js";
import { fruits, players, fruitTypes } from "./logic.js";

export function importGameState(saved) {
  if (!saved) return;

  // RESTAURAR NuMERO DE JUGADORES
  GameState.playerCount = saved.playerCount ?? 2;

  // Limpiar frutas
  fruits.length = 0;
  GameState.fruits.length = 0;

  // Restaurar frutas
  saved.fruits.forEach(f => {
    const info = fruitTypes[f.type];
    const nf = new Fruit(f.x, f.y, f.type, info.radius);

    nf.vx = f.vx;
    nf.vy = f.vy;
    nf.rotation = f.rotation;
    nf.mass = f.mass;
    nf.sleeping = f.sleeping;
    nf.sleepCounter = f.sleepCounter;

    fruits.push(nf);
    GameState.fruits.push(nf);
  });

  // Restaurar jugador 1
  players[0].x = saved.players[0].x;
  players[0].y = saved.players[0].y;

  // Restaurar jugador 2 SOLO si existe
  if (GameState.playerCount === 2 && saved.players[1]) {
    players[1].x = saved.players[1].x;
    players[1].y = saved.players[1].y;
  }

  // Proximas frutas
  GameState.nextFruits = [
    [...saved.nextFruits[0]],
    GameState.playerCount === 2
      ? [...saved.nextFruits[1]]
      : []
  ];

  GameState.gameOver = false;

  console.log("✅ Partida cargada correctamente:", GameState.playerCount, "jugador(es)");
}
