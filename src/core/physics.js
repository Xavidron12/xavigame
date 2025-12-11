export const CONFIG = {
  gravity: 0.28,
  airFriction: 0.996,
  baseBounce: 0.32,
  lowSpeedRestitution: 0,
  sleepSpeed: 0.040,      // ligeramente más alto, detecta reposo mejor
  sleepFrames: 15,        // necesita 15 frames quieta
  baumgarte: 0.25,
  subSteps: 3             // más estable
};

export function applyGravity(f, dt, height) {
  if (!f.sleeping && f.y + f.radius < height) {
    f.vy += CONFIG.gravity * dt;
    sanitizeVelocity(f);
  }
}

export function applyMovement(f, dt) {
  if (!f.sleeping) {
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    sanitizeVelocity(f);
  }
}


export function applyBoundaries(f, width, height) {
  if (f.sleeping) return;

  // IZQUIERDA
  if (f.x - f.radius < 0) {
    f.x = f.radius;
    f.vx = -f.vx * CONFIG.baseBounce;
  }

  // DERECHA
  if (f.x + f.radius > width) {
    f.x = width - f.radius;
    f.vx = -f.vx * CONFIG.baseBounce;
  }

  // TECHO
  if (f.y - f.radius < 0) {
    f.y = f.radius;
    f.vy = -f.vy * CONFIG.baseBounce;
  }

  // SUELO
  if (f.y + f.radius > height) {
    f.y = height - f.radius - 0.4;
    f.vy = -f.vy * CONFIG.lowSpeedRestitution;
    f.vx *= 0.7;
  }
}

export function applyFriction(f) {
  if (!f.sleeping) {
    f.vx *= CONFIG.airFriction;
    f.vy *= CONFIG.airFriction;
    if (!isFinite(f.vx)) f.vx = 0;
    if (!isFinite(f.vy)) f.vy = 0;

  }
}

export function checkSleepState(f, height) {
  const speed = Math.hypot(f.vx, f.vy);

  const onFloor = (f.y + f.radius >= height - 1);

  if (speed < CONFIG.sleepSpeed && onFloor) {
    f.sleepCounter++;
    if (f.sleepCounter >= CONFIG.sleepFrames) {
      f.sleeping = true;
      f.vx = 0;
      f.vy = 0;
    }
  } else {
    f.sleepCounter = 0;
    f.sleeping = false;
  }
}

function sanitizeVelocity(f) {
  if (!isFinite(f.vx)) f.vx = 0;
  if (!isFinite(f.vy)) f.vy = 0;
}

// ===========================================
//  VERSIONES PURAS PARA FUTURO ENGINE FUNCIONAL
// ===========================================

export function pureApplyGravity(vy, dt) {
  return vy + CONFIG.gravity * dt;
}

export function pureApplyAirFriction(v) {
  return v * CONFIG.airFriction;
}

// ===========================================
//   CORRECCIÓN PURA DE LÍMITES
// ===========================================
export function pureBoundaryFix(f, width, height) {
  let { x, y, vx, vy, radius } = f;

  // izquierda
  if (x - radius < 0) {
    x = radius;
    vx = -vx;
  }

  // derecha
  if (x + radius > width) {
    x = width - radius;
    vx = -vx;
  }

  // suelo (sin rebote fuerte aquí)
  if (y + radius > height) {
    y = height - radius;
    vy = 0;
  }

  return { ...f, x, y, vx, vy };
}
