// ===========================================
//  RULES — Lógica pura de reglas del juego
// ===========================================

/**
 * Devuelve true si alguna fruta ha pasado
 * por encima de un límite de seguridad.
 *
 * height: altura total del canvas
 * margin: margen desde arriba donde consideramos "game over"
 */
export function checkGameOver(fruits, height, margin = 40) {
  const limitY = margin; // línea imaginaria cerca del techo

  for (const f of fruits) {
    if (f.y - f.radius <= limitY) {
      return true;
    }
  }

  return false;
}
