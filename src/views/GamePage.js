import { supabase } from "../supabase/supabaseClient.js";
import { startGame } from "../game/startGame.js";
import { GameState } from "../game/state.js";

export function GamePage() {
  const div = document.createElement("div");

  div.innerHTML = `
    <div class="game-page d-flex flex-column align-items-center">

      <!-- === BARRA SUPERIOR DE JUGADORES === -->
      <div class="players-bar">
        <img id="player1-avatar" class="player-avatar" src="/img/cereza.png" />
        <img id="player2-avatar" class="player-avatar" src="/img/platano.png" />
      </div>

      <div class="game-container d-flex align-items-center justify-content-center">

        <!-- Reglas -->
        <div class="rules-card shadow-lg rounded-4 p-4 me-5">
          <h4 class="fw-bold text-light mb-3">🎮 Reglas</h4>
          <ul class="list-unstyled text-light small">
            <li><strong>Jugador 1:</strong></li>
            <li>🕹️ Mover: <kbd>A</kbd> / <kbd>D</kbd></li>
            <li>🍎 Tirar fruta: <kbd>Espacio</kbd></li>
            <hr class="bg-light opacity-25" />
            <li><strong>Jugador 2:</strong></li>
            <li>🕹️ Mover: <kbd>←</kbd> / <kbd>→</kbd></li>
            <li>🍊 Tirar fruta: <kbd>↓</kbd></li>
          </ul>
        </div>

        <div class="next-box small-next me-2">
          <canvas id="nextCanvas1" width="60" height="140"></canvas>
        </div>

        <div class="canvas-wrapper" style="position: relative;">
          <fruit-game></fruit-game>
          <game-over-banner></game-over-banner>
        </div>

        <div class="next-box small-next ms-2">
          <canvas id="nextCanvas2" width="60" height="140"></canvas>
        </div>

        <div class="d-flex flex-column ms-4">
          <button id="saveBtn" type="button" class="btn btn-primary mb-2">
            Guardar Progreso
          </button>
          <button id="exitBtn" type="button" class="btn btn-secondary">
            Salir
          </button>
        </div>

      </div>
    </div>
  `;

  // ==========================
  // INICIAR JUEGO
  // ==========================
  setTimeout(() => {
    startGame();

    // 🔑 AJUSTAR UI SEGÚN Nº DE JUGADORES
    if (GameState.playerCount === 1) {
      // Ocultar jugador 2
      const p2 = div.querySelector("#player2-avatar");
      if (p2) p2.style.display = "none";

      // Ocultar preview jugador 2
      const next2 = div.querySelector("#nextCanvas2");
      if (next2) next2.parentElement.style.display = "none";
    }
  }, 50);

  const saveBtn = div.querySelector("#saveBtn");
  const exitBtn = div.querySelector("#exitBtn");

  // ==========================
  // SALIR
  // ==========================
  exitBtn.onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // ==========================
  // GUARDAR PARTIDA
  // ==========================
  saveBtn.onclick = async (e) => {
    e.preventDefault();
    saveBtn.blur();

    const snap = window.exportGameState();

    const { error } = await supabase.auth.updateUser({
      data: { gameState: { ...snap } }
    });

    if (error) {
      alert("❌ Error al guardar");
    } else {
      alert("✔ Partida guardada");
    }
  };

  return div;
}
