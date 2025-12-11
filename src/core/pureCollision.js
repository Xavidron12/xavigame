// ====================================================
// COLISIÓN PURA — Versión MUY SUAVE (solo separación)
// No fusiona, no rebota fuerte, no afecta al motor real
// ====================================================

export function pureCollisions(fruits) {
  const newFruits = fruits.map(f => ({ ...f }));

  for (let i = 0; i < newFruits.length; i++) {
    for (let j = i + 1; j < newFruits.length; j++) {

      const f1 = newFruits[i];
      const f2 = newFruits[j];

      const dx = f2.x - f1.x;
      const dy = f2.y - f1.y;
      const dist = Math.hypot(dx, dy);
      const minDist = f1.radius + f2.radius;

      if (!isFinite(dist) || dist === 0) continue;
      if (dist >= minDist) continue;

      // normal
      const nx = dx / dist;
      const ny = dy / dist;

      let overlap = minDist - dist;
      if (overlap < 0.1) overlap = 0.1;

      // separar frutas sin rebotes fuertes
      const k1 = f2.mass / (f1.mass + f2.mass);
      const k2 = f1.mass / (f1.mass + f2.mass);

      f1.x -= nx * overlap * k1;
      f1.y -= ny * overlap * k1;

      f2.x += nx * overlap * k2;
      f2.y += ny * overlap * k2;
    }
  }

  return newFruits;
}
