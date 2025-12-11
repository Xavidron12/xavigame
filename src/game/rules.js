export function checkGameOver(fruits, height) {
  const CEILING_LIMIT = 120;  
  // antes solía ser 0 u otro valor muy estrictos

  for (const f of fruits) {
    // si la fruta está muy dormida o parada no pasa nada
    if (f.sleeping === false && f.y - f.radius < CEILING_LIMIT) {
      return true;
    }
  }
  return false;
}
