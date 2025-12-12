import { supabaseREST } from "../supabase/supabaseClient.js";
import { navigate } from "../router/router.js";

export function RegisterPage() {
  const div = document.createElement("div");
  div.className =
    "d-flex flex-column justify-content-center align-items-center vh-100 text-light";

  div.innerHTML = `
    <div class="card bg-dark p-4 rounded-4 shadow" style="width: 350px;">
      <h3 class="text-center mb-3">📝 Crear cuenta</h3>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input id="email" type="email" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input id="password" type="password" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Nombre de perfil</label>
        <input id="name" type="text" class="form-control" />
      </div>

      <p id="msg" class="text-warning small"></p>

      <button id="registerBtn" class="btn btn-success w-100 mb-2">
        Registrar
      </button>
      <button id="backLogin" class="btn btn-outline-light w-100">
        Volver a iniciar sesión
      </button>
    </div>
  `;

  const email = div.querySelector("#email");
  const password = div.querySelector("#password");
  const name = div.querySelector("#name");
  const msg = div.querySelector("#msg");

  div.querySelector("#registerBtn").addEventListener("click", async () => {
    msg.textContent = "";

    try {
      await supabaseREST.signUp(
        email.value.trim(),
        password.value,
        name.value.trim()
      );

      msg.textContent = "Registro correcto. Revisa tu email.";
      setTimeout(() => navigate("/login"), 2000);
    } catch (e) {
      msg.textContent = e.message;
    }
  });

  div.querySelector("#backLogin")
    .addEventListener("click", () => navigate("/login"));

  return div;
}
