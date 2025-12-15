export function updateRotation(fruit) {
  // La rotacion solo dependera de la velocidad horizontal
  fruit.rotation += fruit.vx * 0.02;
}
