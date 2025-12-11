export function updateRotation(fruit) {
  // La rotación depende únicamente de su velocidad horizontal
  fruit.rotation += fruit.vx * 0.02;
}
