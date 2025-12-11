import { fruitTypes } from "../game/logic.js";

// ================================
//   CACHE DE IMÁGENES DE JUGADORES
// ================================
const playerImages = {};

function loadPlayerImage(sprite) {
  if (!playerImages[sprite]) {
    const img = new Image();
    img.src = "/img/" + sprite;
    playerImages[sprite] = img;
  }
  return playerImages[sprite];
}

// ================================
//     DIBUJAR FRUTA INDIVIDUAL
// ================================
export function drawFruit(ctx, fruit) {
  const info = fruitTypes[fruit.type];
  const r = fruit.radius;
  const scale = info.renderScale;

  const offsetY = r * 0.16;

  if (fruit.img && fruit.img.complete) {
    const size = r * 2 * scale;

    ctx.save();
    ctx.translate(fruit.x, fruit.y + offsetY);
    ctx.rotate(fruit.rotation);

    ctx.drawImage(
      fruit.img,
      -size / 2,
      -size / 2,
      size,
      size
    );

    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.arc(fruit.x, fruit.y, r, 0, Math.PI * 2);
    ctx.fillStyle = fruit.color;
    ctx.fill();
    ctx.strokeStyle = "#0008";
    ctx.stroke();
    ctx.closePath();
  }
}

// ================================
//           DIBUJAR MUROS
// ================================
export function drawWalls(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);

  ctx.moveTo(width, 0);
  ctx.lineTo(width, height);

  ctx.moveTo(0, height);
  ctx.lineTo(width, height);

  ctx.stroke();
  ctx.restore();
}

// ================================
//        DIBUJAR JUGADORES
// ================================
export function drawPlayers(ctx, players) {
  players.forEach(p => {
    const img = loadPlayerImage(p.sprite);
    if (!img.complete) return;

    const size = 55;

    ctx.drawImage(
      img,
      p.x - size / 2,
      p.y - size / 2,
      size,
      size
    );
  });
}

// ================================
//         DIBUJAR PREVIEWS
// ================================
export function drawNextFruits(canvasId, list) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);

  const names = [
    "cereza.png",
    "fresa.png",
    "uva.png",
    "limon.png",
    "manzana_verde.png",
    "naranja.png",
    "pera.png",
    "mango.png",
    "aguacate.png",
    "sandia.png"
  ];

  list.forEach((type, i) => {
    const img = new Image();
    img.src = "/img/" + names[type];

    const size = 40;
    const x = c.width / 2 - size / 2;
    const y = 10 + i * 45;

    if (img.complete)
      ctx.drawImage(img, x, y, size, size);
    else
      img.onload = () => ctx.drawImage(img, x, y, size, size);
  });
}
