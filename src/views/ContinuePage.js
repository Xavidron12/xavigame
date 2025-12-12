import { navigate } from "../router/router.js";
import { importGameState } from "../game/importGameState.js";
import { resetGame } from "../game/resetGame.js";
import { GameState } from "../game/state.js";
import { supabase } from "../supabase/supabaseClient.js";

export function ContinuePage(savedState) {
  const div = document.createElement("div");
  div.className = "d-flex justify-content-center align-items-center vh-100 text-light";

  div.innerHTML = `
    <div class="d-flex gap-4">

      <!-- PARTIDA -->
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

      <!-- PERFIL -->
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

  // ================= BOTONES PARTIDA =================
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

  // ================= PERFIL =================
  const saveBtn = div.querySelector("#saveProfile");
  const profileName = div.querySelector("#profileName");
  const avatarFile = div.querySelector("#avatarFile");
  const msg = div.querySelector("#profileMsg");

  saveBtn.onclick = async () => {
    msg.textContent = "";

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      msg.textContent = "Usuario no autenticado";
      return;
    }

    let avatarUrl = user.user_metadata?.avatar_url || null;

    // ================= SUBIR IMAGEN =================
    if (avatarFile.files.length > 0) {
      const file = avatarFile.files[0];

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(`${user.id}.png`, file, { upsert: true });

      if (uploadError) {
        msg.textContent = uploadError.message;
        return;
      }

      // 🔑 OBTENER URL PÚBLICA (ESTO ERA LO QUE FALTABA)
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(`${user.id}.png`);

      avatarUrl = data.publicUrl;
    }

    // ================= GUARDAR PERFIL =================
    const { error } = await supabase.auth.updateUser({
      data: {
        profile_name: profileName.value || "Jugador",
        avatar_url: avatarUrl
      }
    });

    if (error) {
      msg.textContent = error.message;
    } else {
      msg.textContent = "Perfil guardado correctamente";
    }
  };

  return div;
}
