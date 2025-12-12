import { supabaseREST } from "../supabase/supabaseClient.js";
import { navigate } from "../router/router.js";

export function LoginPage() {
  const div = document.createElement("div");
  div.className = "d-flex flex-column justify-content-center align-items-center vh-100 text-light";

  div.innerHTML = `
    <div class="card bg-secondary p-4 rounded-4 shadow" style="width: 350px;">
      <h3 class="text-center mb-3">🔐 Iniciar Sesión</h3>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input id="email" type="email" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input id="password" type="password" class="form-control" />
      </div>

      <p id="msg" class="text-warning small"></p>

      <button id="loginBtn" class="btn btn-primary w-100 mb-2">Entrar</button>
      <button id="goRegister" class="btn btn-outline-light w-100">Crear cuenta</button>
    </div>
  `;

  const email = div.querySelector("#email");
  const password = div.querySelector("#password");
  const msg = div.querySelector("#msg");

  div.querySelector("#loginBtn").addEventListener("click", async () => {
    msg.textContent = "";

    try {
      await supabaseREST.signIn(email.value.trim(), password.value);
      navigate("/");
    } catch (e) {
      msg.textContent = e.message;
    }
  });

  div.querySelector("#goRegister")
    .addEventListener("click", () => navigate("/register"));

  return div;
}
