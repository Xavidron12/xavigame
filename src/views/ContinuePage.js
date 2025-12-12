import { navigate } from "../router/router.js";
import { importGameState } from "../game/importGameState.js";
import { resetGame } from "../game/resetGame.js";
import { GameState } from "../game/state.js";
import { supabaseREST } from "../supabase/supabaseClient.js";

export function ContinuePage(savedState) {
  const div = document.createElement("div");
  div.className = "d-flex justify-content-center align-items-center vh-100 text-light";

  div.innerHTML = `
    <div class="d-flex gap-4">

      <div class="card p-4 rounded-4 shadow" style="width: 320px;">
        <h3 class="text-center mb-3">🎮 Partida</h3>

        <button id="continueBtn" class="btn btn-success w-100 mb-3">
          Continuar partida
        </button>

        <button id="oneBtn" class="btn btn-primary w-100 mb-2">
          Nueva partida (1 jugador)
        </button>

        <button id="twoBtn" class="btn btn-secondary w-100">
          Nueva partida (2 jugadores)
        </button>
      </div>

      <div class="card p-4 rounded-4 shadow" style="width: 320px;">
        <h3 class="text-center mb-3">👤 Perfil</h3>

        <input
          id="profileName"
          class="form-control mb-2"
          placeholder="Nombre de perfil"
        />

        <input
          id="avatarFile"
          type="file"
          class="form-control mb-2"
          accept="image/*"
        />

        <p id="profileMsg" class="small text-warning mb-2"></p>

        <button id="saveProfile" class="btn btn-primary w-100">
          Guardar perfil
        </button>
      </div>

    </div>
  `;

  const continueBtn = div.querySelector("#continueBtn");
  if (!savedState) {
    continueBtn.disabled = true;
    continueBtn.textContent = "No hay partida guardada";
  }

  continueBtn.addEventListener("click", () => {
    if (!savedState) return;
    importGameState(savedState);
    navigate("/game");
  });

  div.querySelector("#oneBtn").addEventListener("click", () => {
    resetGame();
    GameState.playerCount = 1;
    navigate("/game");
  });

  div.querySelector("#twoBtn").addEventListener("click", () => {
    resetGame();
    GameState.playerCount = 2;
    navigate("/game");
  });

  const msg = div.querySelector("#profileMsg");
  const profileName = div.querySelector("#profileName");
  const avatarFile = div.querySelector("#avatarFile");

  const session = supabaseREST.getSession();
  profileName.value = session?.user?.user_metadata?.profile_name || "";

  div.querySelector("#saveProfile").addEventListener("click", async () => {
    msg.textContent = "";

    try {
      const user = await supabaseREST.getUser();
      if (!user) {
        msg.textContent = "Usuario no autenticado";
        return;
      }

      let avatarUrl = user.user_metadata?.avatar_url || null;

      if (avatarFile.files.length > 0) {
        const file = avatarFile.files[0];
        avatarUrl = await supabaseREST.uploadAvatar(file, user.id);
      }

      await supabaseREST.updateUser({
        profile_name: profileName.value || "Jugador",
        avatar_url: avatarUrl
      });

      msg.textContent = "Perfil guardado correctamente";
    } catch (e) {
      msg.textContent = e.message;
    }
  });

  return div;
}
