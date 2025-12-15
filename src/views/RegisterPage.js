import { supabaseREST } from "../supabase/supabaseClient.js";
import { navigate } from "../router/router.js";

export function RegisterPage() {
  const div = document.createElement("div");
  div.className = `d-flex flex-column justify-content-center align-items-center vh-100 text-light`;

  div.innerHTML = `
    <div class="card bg-dark p-4 rounded-4 shadow" style="width: 350px;">
      <h3 class="text-center mb-3"> Crear cuenta</h3>

      <form id="registerForm">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input name="email" type="email" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <input name="password" type="password" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Nombre de perfil</label>
          <input name="name" type="text" class="form-control" />
        </div>

        <p id="msg" class="text-warning small"></p>

        <button class="btn btn-success w-100 mb-2" type="submit">
          Registrar
        </button>
      </form>

      <button id="backLogin" class="btn btn-outline-light w-100">
        Volver a iniciar sesión
      </button>
    </div>
  `;

  const form = div.querySelector("#registerForm");
  const msg = div.querySelector("#msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = ``;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const { email, password, name } = data; 

    try {
      await supabaseREST.signUp(
        email.trim(),
        password,
        name.trim()
      );

      msg.textContent = `Registro correcto. Revisa tu email.`;
      setTimeout(() => navigate(`/login`), 2000);
    } catch (err) {
      msg.textContent = err.message;
    }
  });

  div
    .querySelector("#backLogin")
    .addEventListener("click", () => navigate(`/login`));

  return div;
}
