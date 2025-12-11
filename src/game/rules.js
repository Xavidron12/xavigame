export function checkGameOver(fruits, height) {
  const CEILING_LIMIT = 0;  

  for (const f of fruits) {

    // Solo frutas dormidas cuentan para GAME OVER
    if (!f.sleeping) continue;

    // Si cualquier fruta dormida toca el techo → Perdido
    if (f.y - f.radius < CEILING_LIMIT) {
      return true;
    }
  }

  return false;
}
