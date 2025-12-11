// ===========================================
//  GAME ENGINE (Modo clásico + Modo funcional)
// ===========================================

import { GameState, getGameStateSnapshot } from "./state.js";
import { step } from "./logic.js";
import { pureUpdate } from "./pureUpdate.js";
import { InputState } from "./input.js";
import { checkGameOver } from "./rules.js";

export const GameEngine = {
  usePureMode: false, // FUTURO: activar para usar TODO el motor funcional

  update(dt) {
    if (this.usePureMode) {
      // ================================
      // 🚧 MODO FUNCIONAL COMPLETO (FUTURO)
      // ================================
      const snapshot = getGameStateSnapshot();
      const newState = pureUpdate(snapshot, InputState, dt);
      // Aquí podríamos sincronizar todo en el futuro
      return;
    }

    // ================================
    // 🎮 MODO ACTUAL (CON JUGADORES FUNCIONALES)
    // ================================

    // 1) Jugadores via motor funcional
    const snapshot = getGameStateSnapshot();
    const nextState = pureUpdate(snapshot, InputState, dt);

    GameState.players[0].x = nextState.players[0].x;
    GameState.players[1].x = nextState.players[1].x;

    // 2) Físicas clásicas de frutas
    step(dt, GameState.width, GameState.height);

    // 3) Reglas puras: comprobar GAME OVER
    const isOver = checkGameOver(GameState.fruits, GameState.height);
    GameState.gameOver = isOver;
  }
};
