// ===========================================
//  RENDER SYSTEM (independiente del DOM global)
// ===========================================

import { drawFruit, drawWalls, drawPlayers } from "./render.js";

export function renderGame(ctx, width, height, gameState) {
  // Limpiar pantalla
  ctx.clearRect(0, 0, width, height);

  // Dibujar paredes
  drawWalls(ctx, width, height);

  // Dibujar jugadores
  drawPlayers(ctx, gameState.players);

  // Dibujar frutas
  for (const f of gameState.fruits) {
    drawFruit(ctx, f);
  }
}
