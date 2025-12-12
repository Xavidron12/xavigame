import { GameConfig } from "./state.js";

export function pureUpdate(prevState, input, dt) {
  const next = {
    ...prevState,
    players: prevState.players.map(p => ({ ...p }))
  };

  const speed = GameConfig.playerSpeed;

  const p1 = next.players[0];
  if (input.p1.left) p1.x -= speed;
  if (input.p1.right) p1.x += speed;

  p1.x = Math.max(
    GameConfig.playerPadding,
    Math.min(prevState.width - GameConfig.playerPadding, p1.x)
  );

  if (prevState.playerCount === 2) {
    const p2 = next.players[1];
    if (input.p2.left) p2.x -= speed;
    if (input.p2.right) p2.x += speed;

    p2.x = Math.max(
      GameConfig.playerPadding,
      Math.min(prevState.width - GameConfig.playerPadding, p2.x)
    );
  }

  return next;
}
