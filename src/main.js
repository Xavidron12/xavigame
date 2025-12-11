import { subscribe } from "./game/observableState.js";
import { drawNextFruits } from "./render/render.js";
import { exportGameState } from "./game/exportGameState.js";

window.exportGameState = exportGameState;

import "./ui/FruitGame.js";
import "./ui/GameOverBanner.js";

import { router } from "./router/router.js";

subscribe("nextFruits", (value) => {
  drawNextFruits("nextCanvas1", value[0]);
  drawNextFruits("nextCanvas2", value[1]);
});

// arrancar router
window.addEventListener("DOMContentLoaded", router);
