import { LoginPage } from "../views/LoginPage.js";
import { RegisterPage } from "../views/RegisterPage.js";
import { GamePage } from "../views/GamePage.js";
import { ContinuePage } from "../views/ContinuePage.js";
import { supabase } from "../supabase/supabaseClient.js";

export function navigate(path) {
  window.history.pushState({}, "", path);
  router();
}

export async function router() {
  console.log("📡 Router cargado");

  const root = document.getElementById("app");
  const path = window.location.pathname;

  // Limpiamos contenido siempre
  root.innerHTML = "";

  // Obtener sesión Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const logged = !!session;

  // === LOGIN ===
  if (path === "/login") {
    root.appendChild(LoginPage());
    return;
  }

  // === REGISTER ===
  if (path === "/register") {
    root.appendChild(RegisterPage());
    return;
  }

  // === GAME ===
  if (path === "/game") {
    if (!logged) return navigate("/login");
    root.appendChild(GamePage());
    return;
  }

  // === ROOT "/" ===
  if (path === "/") {
    if (!logged) return navigate("/login");

    const saved = session.user.user_metadata?.gameState;

    if (saved) {
      root.appendChild(ContinuePage(saved));
      return;
    }

    // si no hay partida guardada, ir al juego directamente
    navigate("/game");
    return;
  }

  // === Cualquier otra ruta ===
  navigate("/login");
}

// Navegación con botones del navegador
window.onpopstate = router;