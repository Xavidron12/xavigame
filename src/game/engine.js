import { GameState, getGameStateSnapshot } from "./state.js";
import { step } from "./logic.js";
import { pureUpdate } from "./pureUpdate.js";
import { InputState } from "./input.js";
import { checkGameOver } from "./rules.js";

export const GameEngine = {
  update(dt) {
    if (GameState.gameOver) return;

    const snapshot = getGameStateSnapshot();
    const nextState = pureUpdate(snapshot, InputState, dt);

    GameState.players[0].x = nextState.players[0].x;

    if (GameState.playerCount === 2) {
      GameState.players[1].x = nextState.players[1].x;
    }

    step(dt, GameState.width, GameState.height);
    GameState.gameOver = checkGameOver(GameState.fruits, GameState.height);
  }
};
