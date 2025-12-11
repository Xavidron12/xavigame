const fruitImages = [
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

export default class Fruit {
  constructor(x, y, type, radius, color) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.type = type;
    this.radius = radius;
    this.color = color;
    this.mass = Math.max(1, radius * 0.5);
    this.sleepCounter = 0;
    this.sleeping = false;

    this.rotation = 0;

    this.img = new Image();
    this.img.src = "/img/" + fruitImages[type];
  }

  aabb() {
    return {
      minX: this.x - this.radius,
      maxX: this.x + this.radius,
      minY: this.y - this.radius,
      maxY: this.y + this.radius
    };
  }
}
