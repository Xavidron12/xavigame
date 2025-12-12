import { LoginPage } from "../views/LoginPage.js";
import { RegisterPage } from "../views/RegisterPage.js";
import { GamePage } from "../views/GamePage.js";
import { ContinuePage } from "../views/ContinuePage.js";
import { supabaseREST } from "../supabase/supabaseClient.js";

export function navigate(path) {
  history.pushState({}, "", path);
  router();
}

export function router() {
  const root = document.querySelector("#app");
  const path = location.pathname;
  root.innerHTML = "";

  const session = supabaseREST.getSession();
  const logged = !!session;

  if (path === "/login") {
    root.appendChild(LoginPage());
    return;
  }

  if (path === "/register") {
    root.appendChild(RegisterPage());
    return;
  }

  if (path === "/game") {
    if (!logged) return navigate("/login");
    root.appendChild(GamePage());
    return;
  }

  if (path === "/") {
    if (!logged) return navigate("/login");
    const saved = session?.user?.user_metadata?.gameState;
    root.appendChild(ContinuePage(saved));
    return;
  }

  navigate("/login");
}

window.addEventListener("popstate", router);
