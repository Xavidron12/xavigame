// =====================================================
//  MAIN.JS — SOLO router + webcomponents + export
//  (NINGÚN INPUT AQUÍ, NINGÚN SPAWNFRUIT)
// =====================================================

// Motor (solo cosas necesarias globalmente)
import { nextFruits } from "./game/logic.js";
import { drawNextFruits } from "./render/render.js";
import { subscribe } from "./game/observableState.js";
import { exportGameState } from "./game/exportGameState.js";
window.exportGameState = exportGameState;

// Web Components
import "./ui/FruitGame.js";
import "./ui/GameOverBanner.js";

// Router
import { router } from "./router/router.js";


// =====================================================
//  REACTIVIDAD SOLO PARA PREVIEWS
// =====================================================
subscribe("nextFruits", (value) => {
  drawNextFruits("nextCanvas1", value[0]);
  drawNextFruits("nextCanvas2", value[1]);
});


// =====================================================
//  ARRANCAR ROUTER
// =====================================================
window.addEventListener("DOMContentLoaded", () => {
  router();
});
