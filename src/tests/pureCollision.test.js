import { describe, it, expect } from "vitest";
import { pureCollisions } from "../core/pureCollision.js";

describe("pureCollisions", () => {
  it("separa frutas solapadas", () => {
    const fruits = [
      { x: 0, y: 0, radius: 10, mass: 1 },
      { x: 5, y: 0, radius: 10, mass: 1 }
    ];

    const result = pureCollisions(fruits);

    expect(result[0].x).not.toBe(0);
    expect(result[1].x).not.toBe(5);
  });

  it("no modifica el array original", () => {
    const fruits = [
      { x: 0, y: 0, radius: 10, mass: 1 },
      { x: 50, y: 0, radius: 10, mass: 1 }
    ];

    const copy = JSON.stringify(fruits);
    pureCollisions(fruits);

    expect(JSON.stringify(fruits)).toBe(copy);
  });
});
