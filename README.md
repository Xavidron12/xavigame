# XaviGame 

Proyecto SPA desarrollado en JavaScript moderno para la asignatura **Desarrollo Web Cliente (2º DAW)**.

El proyecto consiste en un juego inspirado en *Suika Game*, con autenticación, guardado de partida, perfil de usuario y arquitectura modular.

---

##  Arquitectura

- **SPA (Single Page Application)** con router propio
- **Arquitectura modular (MVC aproximado)**
- Separación clara entre:
  - lógica del juego
  - render
  - estado
  - vistas
  - router
  - servicios (API REST)

---

##  Tecnologías utilizadas

- **JavaScript ES6+**
- **Vite** (empaquetado y desarrollo)
- **RxJS** (programación reactiva)
- **Vitest** (tests unitarios)
- **Supabase REST API** (sin SDK)
- **LocalStorage** (persistencia de sesión)
- **HTML5 Canvas**
- **CSS + Bootstrap**

---

##  Autenticación y API REST

- Login y registro de usuarios mediante **Supabase REST**
- Gestión de sesión usando **LocalStorage**
- Perfil de usuario con:
  - nombre
  - avatar (almacenado en Supabase Storage)
- Guardado y recuperación del estado del juego en el perfil del usuario

>  No se utiliza el SDK de Supabase, solo llamadas REST con `fetch`.

---

##  Programación Reactiva

- Uso de **RxJS**:
  - `BehaviorSubject` para estado observable
  - `fromEvent` para gestionar eventos de teclado
- El estado del juego notifica automáticamente a la UI (previews, game over, etc.)

---

##  Programación Funcional

- Uso de funciones **puras** siempre que es posible
- Funciones impuras solo cuando:
  - se modifica el DOM
  - se accede a APIs externas
- Uso de:
  - copias inmutables
  - `map`
  - separación de responsabilidades

---

##  Tests

- Tests unitarios realizados con **Vitest**
- Se testean todas las funciones puras importantes:
  - `pureUpdate`
  - `pureCollisions`
  - `pureApplyGravity`
  - `pureApplyAirFriction`
  - `pureBoundaryFix`
- Uso de **mocking** para aislar dependencias de estado global

Ejecutar tests:
```bash
npm run test
