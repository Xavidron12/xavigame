import { describe, it, expect, vi } from "vitest";

// ===============================
// MOCK del GameConfig
// ===============================
vi.mock("../game/state.js", () => {
  return {
    GameConfig: {
      playerSpeed: 5,
      playerPadding: 25
    }
  };
});

import { pureUpdate } from "../game/pureUpdate.js";

describe("pureUpdate", () => {
  it("mueve al jugador 1 a la izquierda", () => {
    const prevState = {
      width: 600,
      height: 600,
      playerCount: 1,
      players: [{ x: 100, y: 0 }]
    };

    const input = {
      p1: { left: true, right: false },
      p2: {}
    };

    const next = pureUpdate(prevState, input, 1);

    expect(next.players[0].x).toBeLessThan(100);
  });

  it("no permite salir del límite izquierdo", () => {
    const prevState = {
      width: 600,
      height: 600,
      playerCount: 1,
      players: [{ x: 5, y: 0 }]
    };

    const input = {
      p1: { left: true, right: false },
      p2: {}
    };

    const next = pureUpdate(prevState, input, 1);

    expect(next.players[0].x).toBeGreaterThanOrEqual(25);
  });
});
