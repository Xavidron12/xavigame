# XaviGame 🎮🍎

Proyecto desarrollado como SPA (Single Page Application) para la asignatura de **Desarrollo Web Cliente**.

El proyecto consiste en un videojuego tipo *Suika Game*, con autenticación, guardado de partida, sistema reactivo y arquitectura modular.

---

## 🧱 Tecnologías utilizadas

- **JavaScript ES Modules**
- **Vite** (dev server + build)
- **Supabase**
  - Autenticación
  - Storage de imágenes (avatars)
  - Guardado de estado de partida
- **RxJS**
- **Web Components**
- **HTML5 Canvas**
- **Bootstrap 5**
- **ESLint**
- **Vitest**

---

## 🧠 Arquitectura

El proyecto sigue una aproximación a **MVC + SPA**:

- **Model**
  - `GameState`
  - Estado observable con Proxy + RxJS
- **View**
  - Vistas dinámicas (`LoginPage`, `RegisterPage`, `GamePage`, etc.)
  - Web Components (`<fruit-game>`, `<game-over-banner>`)
- **Controller**
  - Router SPA propio
  - GameEngine y lógica del juego

---

## 🔄 Programación reactiva

- Se utiliza **RxJS** para gestionar estado reactivo.
- El estado del juego notifica automáticamente cambios relevantes (por ejemplo `nextFruits`, `gameOver`).
- No se utilizan frameworks externos (React, Vue).

---

## 🧪 Tests

Se han implementado tests unitarios con **Vitest** para funciones puras:

- Físicas
- Colisiones puras
- Actualización de estado (`pureUpdate`)

```bash
npm run test
