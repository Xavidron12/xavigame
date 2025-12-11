import { navigate } from "../router/router.js";
import { importGameState } from "../game/importGameState.js";
import { resetGame } from "../game/resetGame.js";

export function ContinuePage(savedState) {
  const div = document.createElement("div");
  div.className = "d-flex flex-column justify-content-center align-items-center vh-100 text-light";

  div.innerHTML = `
    <div class="card bg-dark p-4 rounded-4 shadow" style="width: 350px;">
      <h3 class="text-center mb-3">🎮 Continuar partida</h3>
      <p class="text-center small">Tienes una partida guardada.</p>

      <button id="continueBtn" class="btn btn-success w-100 mb-2">Continuar donde lo dejé</button>
      <button id="newBtn" class="btn btn-secondary w-100">Nueva partida</button>
    </div>
  `;

  // Continuar partida → cargar estado
  div.querySelector("#continueBtn").onclick = () => {
    importGameState(savedState);
    navigate("/game");
  };

  // Nueva partida → RESET + ir al juego limpio
  div.querySelector("#newBtn").onclick = () => {
    resetGame();
    navigate("/game");
  };

  return div;
}
