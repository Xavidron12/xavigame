import { supabaseREST } from "../supabase/supabaseClient.js";
import { startGame } from "../game/startGame.js";
import { GameState } from "../game/state.js";

export function GamePage() {
  const div = document.createElement("div");

  div.innerHTML = `
    <div class="game-page d-flex flex-column align-items-center">

      <div class="players-bar">
        <img id="player1-avatar" class="player-avatar" src="/img/cereza.png" />
        <img id="player2-avatar" class="player-avatar" src="/img/platano.png" />
      </div>

      <div class="game-container d-flex align-items-start justify-content-center">

        <div class="d-flex flex-column me-5">

          <div class="profile-hud card p-3 mb-3 text-center">
            <div id="hud-name" class="hud-name mb-2">Jugador</div>
            <img id="hud-avatar" class="hud-avatar" />
          </div>

          <div class="rules-card shadow-lg rounded-4 p-4">
            <h4 class="fw-bold mb-3">🎮 Reglas</h4>
            <ul class="list-unstyled small">
              <li><strong>Jugador 1:</strong></li>
              <li>🕹️ Mover: <kbd>A</kbd> / <kbd>D</kbd></li>
              <li>🍎 Tirar fruta: <kbd>Espacio</kbd></li>
              <hr class="opacity-25" />
              <li><strong>Jugador 2:</strong></li>
              <li>🕹️ Mover: <kbd>←</kbd> / <kbd>→</kbd></li>
              <li>🍊 Tirar fruta: <kbd>↓</kbd></li>
            </ul>
          </div>
        </div>

        <div class="next-box small-next me-2">
          <canvas id="nextCanvas1" width="60" height="140"></canvas>
        </div>

        <div class="canvas-wrapper">
          <fruit-game></fruit-game>
          <game-over-banner></game-over-banner>
        </div>

        <div class="next-box small-next ms-2">
          <canvas id="nextCanvas2" width="60" height="140"></canvas>
        </div>

        <div class="d-flex flex-column ms-4">
          <button id="saveBtn" class="btn btn-primary mb-2">Guardar Progreso</button>
          <button id="exitBtn" class="btn btn-secondary">Salir</button>
        </div>

      </div>
    </div>
  `;

  const session = supabaseREST.getSession();
  const avatar = div.querySelector("#hud-avatar");
  const name = div.querySelector("#hud-name");

  avatar.src = session?.user?.user_metadata?.avatar_url
    ? session.user.user_metadata.avatar_url + `?t=${Date.now()}`
    : "/img/cereza.png";

  name.textContent = session?.user?.user_metadata?.profile_name || "Jugador";

  setTimeout(() => {
    startGame();

    if (GameState.playerCount === 1) {
      const p2 = div.querySelector("#player2-avatar");
      if (p2) p2.style.display = "none";

      const next2 = div.querySelector("#nextCanvas2");
      if (next2) next2.parentElement.style.display = "none";
    }
  }, 50);

  div.querySelector("#exitBtn").addEventListener("click", () => {
    supabaseREST.logout();
    window.location.href = "/login";
  });

  div.querySelector("#saveBtn").addEventListener("click", async () => {
    const snap = window.exportGameState();
    await supabaseREST.updateUser({ gameState: snap });
    alert("✔ Partida guardada");
  });

  return div;
}
