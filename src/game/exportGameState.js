// =====================================================
//   EXPORTAR ESTADO DEL JUEGO → Guardar en Supabase
// =====================================================

import { GameState } from "./state.js";

export function exportGameState() {
  const fruits = GameState.fruits.map(f => ({
    x: Number(f.x),
    y: Number(f.y),
    vx: Number(f.vx),
    vy: Number(f.vy),
    type: f.type,
    radius: f.radius,
    mass: f.mass,
    sleeping: !!f.sleeping,
    sleepCounter: f.sleepCounter,
    rotation: Number(f.rotation)
  }));

  const players = GameState.players.map(p => ({
    x: Number(p.x),
    y: Number(p.y),
    sprite: p.sprite
  }));

  const nextFruits = [
    [...GameState.nextFruits[0]],
    [...GameState.nextFruits[1]]
  ];

  return {
    // 🔑 CLAVE: guardar modo de juego
    playerCount: GameState.playerCount,

    fruits,
    players,
    nextFruits
  };
}
