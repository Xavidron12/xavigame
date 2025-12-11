import { supabase } from "../supabase/supabaseClient.js";
import { startGame } from "../game/startGame.js";

export function GamePage() {
  const div = document.createElement("div");

  div.innerHTML = `
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

      <div id="next1" class="next-box small-next me-2">
        <canvas id="nextCanvas1" width="60" height="140"></canvas>
      </div>

      <div class="canvas-wrapper" style="position: relative;">
        <fruit-game></fruit-game>
        <game-over-banner></game-over-banner>
      </div>

      <div id="next2" class="next-box small-next ms-2">
        <canvas id="nextCanvas2" width="60" height="140"></canvas>
      </div>

      <div class="d-flex flex-column ms-4">
        <button id="saveBtn" class="btn btn-primary mb-2">Guardar Progreso</button>
        <button id="exitBtn" class="btn btn-secondary">Salir</button>
      </div>

    </div>
  `;

  // ==========================
  // 🔥 Arrancar juego
  // ==========================
  setTimeout(() => startGame(), 50);

  // ==========================
  // 🔹 Botón SALIR
  // ==========================
  div.querySelector("#exitBtn").onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // ==========================
  // 🔹 Botón GUARDAR
  // ==========================
  div.querySelector("#saveBtn").onclick = async () => {
    const snap = window.exportGameState();

    const { error } = await supabase.auth.updateUser({
      data: { gameState: { ...snap } }   // ⚡ Fuerza actualización real
    });

    if (error) {
      console.error("❌ Error guardando:", error);
      alert("❌ Error al guardar");
    } else {
      alert("✔ Partida guardada");
    }
  };

  return div;
}
