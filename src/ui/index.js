// ==========================
//   REGISTRO DE COMPONENTES
// ==========================

import { LoginPage } from "../views/LoginPage.js";
import { RegisterPage } from "../views/RegisterPage.js";
import { GamePage } from "../views/GamePage.js";
import { ContinuePage } from "../views/ContinuePage.js";

// Registrar Web Components
customElements.define("login-page", LoginPage);
customElements.define("register-page", RegisterPage);
customElements.define("game-page", GamePage);
customElements.define("continue-page", ContinuePage);

// ==========================
//     COMPONENTES DEL JUEGO
// ==========================
import "./FruitGame.js";
import "./GameOverBanner.js";

// ==========================
//           ROUTER
// ==========================
import { router } from "../router/router.js";

// Ejecutar router al cargar
window.addEventListener("DOMContentLoaded", router);
