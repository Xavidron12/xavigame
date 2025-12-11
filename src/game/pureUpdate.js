// ===========================================
//   PURE UPDATE — Motor funcional del juego
//   (Actualiza jugadores sin efectos colaterales)
// ===========================================

import { GameConfig } from "./state.js";

export function pureUpdate(prevState, input, dt) {
  // Clonamos el estado sin mutar nada
  const next = {
    ...prevState,
    players: prevState.players.map(p => ({ ...p })) // copia profunda
  };

  const speed = GameConfig.playerSpeed;

  // Jugador 1
  let p1 = next.players[0];
  if (input.p1.left) p1.x -= speed;
  if (input.p1.right) p1.x += speed;

  // Jugador 2
  let p2 = next.players[1];
  if (input.p2.left) p2.x -= speed;
  if (input.p2.right) p2.x += speed;

  // Clamping para evitar que salgan del área
  p1.x = Math.max(GameConfig.playerPadding, Math.min(prevState.width - GameConfig.playerPadding, p1.x));
  p2.x = Math.max(GameConfig.playerPadding, Math.min(prevState.width - GameConfig.playerPadding, p2.x));

  return next;
}
