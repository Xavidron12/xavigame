// ======================================================
//   <game-over-banner> — Mensaje reactivo de GAME OVER
// ======================================================

import { subscribe } from "../game/observableState.js";

export class GameOverBanner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Poppins', sans-serif;
          font-size: 36px;
          font-weight: bold;
          padding: 20px 40px;
          color: #fff;
          background: rgba(0, 0, 0, 0.7);
          border: 3px solid #fff;
          border-radius: 12px;
          display: none;
          z-index: 9999;
        }
      </style>

      <div>GAME OVER</div>
    `;
  }

  connectedCallback() {
    subscribe("gameOver", (value) => {
      this.style.display = value ? "block" : "none";
    });
  }
}

customElements.define("game-over-banner", GameOverBanner);
