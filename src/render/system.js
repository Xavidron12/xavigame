// ===========================================
//  RENDER SYSTEM
// ===========================================

import { drawFruit, drawWalls } from "./render.js";

export function renderGame(ctx, width, height, gameState) {

  // Limpiar pantalla
  ctx.clearRect(0, 0, width, height);

  // Dibujar paredes
  drawWalls(ctx, width, height);

  // Dibujar frutas
  for (const f of gameState.fruits) {
    drawFruit(ctx, f);
  }
}
