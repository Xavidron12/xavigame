import { describe, it, expect } from "vitest";
import {
  pureApplyGravity,
  pureApplyAirFriction,
  pureBoundaryFix
} from "../core/physics.js";

describe("physics pure functions", () => {
  it("aplica gravedad correctamente", () => {
    const vy = pureApplyGravity(0, 1);
    expect(vy).toBeGreaterThan(0);
  });

  it("aplica fricción del aire", () => {
    const v = pureApplyAirFriction(10);
    expect(v).toBeLessThan(10);
  });

  it("corrige límites del suelo", () => {
    const fruit = {
      x: 100,
      y: 610,
      vx: 0,
      vy: 5,
      radius: 10
    };

    const fixed = pureBoundaryFix(fruit, 600, 600);
    expect(fixed.y).toBeLessThanOrEqual(590);
    expect(fixed.vy).toBe(0);
  });
});
