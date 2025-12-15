import Fruit from "../game/Fruit.js";

export function collisionsAndFusion(fruits, fruitTypes) {
  const cellSize = 48;
  const spatial = Object.create(null);

  function addToCell(cx, cy, index) {
    const key = `${cx},${cy}`;
    if (!spatial[key]) spatial[key] = [];
    spatial[key].push(index);
  }

  // El hash
  for (let i = 0; i < fruits.length; i++) {
    const f = fruits[i];
    const a = f.aabb();
    const minX = Math.floor(a.minX / cellSize);
    const maxX = Math.floor(a.maxX / cellSize);
    const minY = Math.floor(a.minY / cellSize);
    const maxY = Math.floor(a.maxY / cellSize);

    for (let cx = minX; cx <= maxX; cx++) {
      for (let cy = minY; cy <= maxY; cy++) {
        addToCell(cx, cy, i);
      }
    }
  }

  const toRemove = new Set();
  const toAdd = [];

  // Aqui las colisiones
  for (const key in spatial) {
    const cell = spatial[key];
    const len = cell.length;

    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const idx1 = cell[i];
        const idx2 = cell[j];
        if (idx1 === idx2) continue;

        const f1 = fruits[idx1];
        const f2 = fruits[idx2];
        if (!f1 || !f2) continue;
        if (toRemove.has(f1) || toRemove.has(f2)) continue;

        handleCollision(f1, f2, toAdd, toRemove, fruitTypes);
      }
    }
  }

  // Aplicamos cambios
  const finalList = [];
  for (const f of fruits) {
    if (!toRemove.has(f)) finalList.push(f);
  }
  fruits.length = 0;
  fruits.push(...finalList, ...toAdd);
}

function handleCollision(f1, f2, toAdd, toRemove, fruitTypes) {
  const dx = f2.x - f1.x;
  const dy = f2.y - f1.y;
  const dist = Math.hypot(dx, dy);
  if (!isFinite(dist) || dist <= 0) return;
  const minDist = f1.radius + f2.radius;

  if (dist >= minDist) return;

  // Si las dos duermen, nada
  if (f1.sleeping && f2.sleeping) return;

  // Despertar si estaban dormidas
  if (f1.sleeping) f1.sleeping = false;
  if (f2.sleeping) f2.sleeping = false;

  // =====================================================
  //             FUSIÓN 
  // =====================================================
  if (f1.type === f2.type) {
    const lastType = fruitTypes.length - 1;

    // 🔴 Si son SANDÍAS (último tipo) → desaparecen
    if (f1.type >= lastType) {
      toRemove.add(f1);
      toRemove.add(f2);
      return;
    }

    // Fusión normal → fruta de tipo siguiente
    const next = f1.type + 1;
    const info = fruitTypes[next];

    const midX = (f1.x + f2.x) / 2;
    const midY = (f1.y + f2.y) / 2;
    if (!isFinite(midX) || !isFinite(midY)) return;

    const nf = new Fruit(midX, midY, next, info.radius, info.color);
    nf.vx = (f1.vx + f2.vx) * 0.5;
    nf.vy = (f1.vy + f2.vy) * 0.5;

    toAdd.push(nf);
    toRemove.add(f1);
    toRemove.add(f2);
    return;
  }

  // =====================================================
  //             COLISIÓN NORMAL
  // =====================================================
  const nx = dx / dist;
  const ny = dy / dist;

  let overlap = minDist - dist;
  if (overlap > 20) overlap = 20;
  if (overlap < 0.1) overlap = 0.1;

  const correction = (f1.sleeping || f2.sleeping)
    ? overlap
    : overlap * 1.10;

  const totalMass = f1.mass + f2.mass;
  const k1 = f2.mass / totalMass;
  const k2 = f1.mass / totalMass;

  f1.x -= nx * correction * k1;
  f1.y -= ny * correction * k1;
  f2.x += nx * correction * k2;
  f2.y += ny * correction * k2;

  const rvx = f2.vx - f1.vx;
  const rvy = f2.vy - f1.vy;
  const relVel = rvx * nx + rvy * ny;

  if (relVel > 0) return;

  const restitution = 0.55;
  const impulse = -(1 + restitution) * relVel / totalMass;

  const ix = impulse * nx;
  const iy = impulse * ny;

  f1.vx -= ix * f2.mass;
  f1.vy -= iy * f2.mass;

  f2.vx += ix * f1.mass;
  f2.vy += iy * f1.mass;

  limitVelocity(f1);
  limitVelocity(f2);
}

function limitVelocity(f) {
  const maxSpeed = 50;
  const speed = Math.hypot(f.vx, f.vy);

  if (speed > maxSpeed) {
    const scale = maxSpeed / speed;
    f.vx *= scale;
    f.vy *= scale;
  }
}
