import { supabaseREST } from "../supabase/supabaseClient.js";
import { navigate } from "../router/router.js";

export function LoginPage() {
  const div = document.createElement("div");
  div.className = `d-flex flex-column justify-content-center align-items-center vh-100 text-light`;

  div.innerHTML = `
    <div class="card bg-secondary p-4 rounded-4 shadow" style="width: 350px;">
      <h3 class="text-center mb-3">🔐 Iniciar Sesión</h3>

      <form id="loginForm">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input name="email" type="email" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <input name="password" type="password" class="form-control" />
        </div>

        <p id="msg" class="text-warning small"></p>

        <button class="btn btn-primary w-100 mb-2" type="submit">
          Entrar
        </button>
      </form>

      <button id="goRegister" class="btn btn-outline-light w-100">
        Crear cuenta
      </button>
    </div>
  `;

  const form = div.querySelector("#loginForm");
  const msg = div.querySelector("#msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = ``;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const { email, password } = data; // object destructuring

    try {
      await supabaseREST.signIn(email.trim(), password);
      navigate(`/`);
    } catch (err) {
      msg.textContent = err.message;
    }
  });

  div
    .querySelector("#goRegister")
    .addEventListener("click", () => navigate(`/register`));

  return div;
}
