import { navigate } from "../router/router.js";
import { importGameState } from "../game/importGameState.js";
import { resetGame } from "../game/resetGame.js";
import { GameState } from "../game/state.js";

export function ContinuePage(savedState) {
  const div = document.createElement("div");
  div.className = "d-flex flex-column justify-content-center align-items-center vh-100 text-light";

  div.innerHTML = `
    <div class="card bg-dark p-4 rounded-4 shadow" style="width: 350px;">
      <h3 class="text-center mb-3">🎮 Continuar partida</h3>

      <button id="continueBtn" class="btn btn-success w-100 mb-3">
        Continuar partida guardada
      </button>

      <hr class="opacity-25">

      <button id="oneBtn" class="btn btn-primary w-100 mb-2">
        Nueva partida (1 jugador)
      </button>

      <button id="twoBtn" class="btn btn-secondary w-100">
        Nueva partida (2 jugadores)
      </button>
    </div>
  `;

  div.querySelector("#continueBtn").onclick = () => {
    importGameState(savedState);
    navigate("/game");
  };

  div.querySelector("#oneBtn").onclick = () => {
    resetGame();
    GameState.playerCount = 1;
    navigate("/game");
  };

  div.querySelector("#twoBtn").onclick = () => {
    resetGame();
    GameState.playerCount = 2;
    navigate("/game");
  };

  return div;
}
