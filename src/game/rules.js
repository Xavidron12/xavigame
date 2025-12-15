export function checkGameOver(fruits, height) {
  const CEILING_LIMIT = 0;     // techo real del canvas (y=0)
  const GRACE_MS = 400;        // margen para que no salte al spawnear

  const now = performance.now();

  for (const f of fruits) {
    const t0 = f.spawnTime ?? 0;

    // Ignorar frutas recien creadas
    if (now - t0 < GRACE_MS) continue;

    // GameOver si cualquier fruta toca/pasa el techo (da igual sleeping)
    if (f.y - f.radius <= CEILING_LIMIT) return true;
  }

  return false;
}
