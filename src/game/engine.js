// =====================================================
//  GAME ENGINE — Controlador del ciclo de juego
// =====================================================

import { GameState, getGameStateSnapshot } from "./state.js";
import { step } from "./logic.js";
import { pureUpdate } from "./pureUpdate.js";
import { InputState } from "./input.js";
import { checkGameOver } from "./rules.js";

export const GameEngine = {
  usePureMode: false,

  update(dt) {

    // ⛔ Si el juego terminó → congelar todo
    if (GameState.gameOver) return;

    // Modo funcional para jugadores
    const snapshot = getGameStateSnapshot();
    const nextState = pureUpdate(snapshot, InputState, dt);

    GameState.players[0].x = nextState.players[0].x;
    GameState.players[1].x = nextState.players[1].x;

    // Físicas
    step(dt, GameState.width, GameState.height);

    // Reglas de "game over"
    GameState.gameOver = checkGameOver(GameState.fruits, GameState.height);
  }
};
