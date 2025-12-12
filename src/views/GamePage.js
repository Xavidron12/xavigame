import { supabase } from "../supabase/supabaseClient.js";
import { startGame } from "../game/startGame.js";
import { GameState } from "../game/state.js";

export function GamePage() {
  const div = document.createElement("div");

  div.innerHTML = `
    <div class="game-page d-flex flex-column align-items-center">

      <div class="game-container d-flex align-items-start justify-content-center">

        <!-- COLUMNA IZQUIERDA -->
        <div class="d-flex flex-column me-5">

          <!-- PERFIL EN JUEGO -->
          <div class="profile-hud card p-3 mb-3 text-center">
            <img id="hud-avatar" class="hud-avatar mb-2" />
            <div id="hud-name" class="hud-name">Jugador</div>
          </div>

          <!-- REGLAS -->
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

        <!-- PREVIEW IZQUIERDA -->
        <div class="next-box small-next me-2">
          <canvas id="nextCanvas1" width="60" height="140"></canvas>
        </div>

        <!-- JUEGO -->
        <div class="canvas-wrapper" style="position: relative;">
          <fruit-game></fruit-game>
          <game-over-banner></game-over-banner>
        </div>

        <!-- PREVIEW DERECHA -->
        <div class="next-box small-next ms-2">
          <canvas id="nextCanvas2" width="60" height="140"></canvas>
        </div>

        <!-- BOTONES -->
        <div class="d-flex flex-column ms-4">
          <button id="saveBtn" class="btn btn-primary mb-2">
            Guardar Progreso
          </button>
          <button id="exitBtn" class="btn btn-secondary">
            Salir
          </button>
        </div>

      </div>
    </div>
  `;

  // ==========================
  // CARGAR PERFIL
  // ==========================
  supabase.auth.getUser().then(({ data }) => {
    const user = data.user;
    if (!user) return;

    const avatar = div.querySelector("#hud-avatar");
    const name = div.querySelector("#hud-name");

    avatar.src = user.user_metadata?.avatar_url
      ? user.user_metadata.avatar_url + "?t=" + Date.now()
      : "/img/cereza.png";

    name.textContent = user.user_metadata?.profile_name || "Jugador";
  });

  // ==========================
  // INICIAR JUEGO
  // ==========================
  setTimeout(() => {
    startGame();

    if (GameState.playerCount === 1) {
      const next2 = div.querySelector("#nextCanvas2");
      if (next2) next2.parentElement.style.display = "none";
    }
  }, 50);

  // ==========================
  // BOTONES
  // ==========================
  div.querySelector("#exitBtn").onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  div.querySelector("#saveBtn").onclick = async (e) => {
    e.preventDefault();

    const snap = window.exportGameState();

    await supabase.auth.updateUser({
      data: { gameState: { ...snap } }
    });

    alert("✔ Partida guardada");
  };

  return div;
}
