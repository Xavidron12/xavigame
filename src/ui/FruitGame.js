// ======================================================
//   <fruit-game> — Web Component que contiene el canvas
// ======================================================

export class FruitGame extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        canvas {
          display: block;
          border: none;
          background: transparent;
        }

        .wrapper {
          position: relative;
        }
      </style>

      <div class="wrapper">
        <canvas id="gameCanvas" width="600" height="600"></canvas>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("fruit-game", FruitGame);
