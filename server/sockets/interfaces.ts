export interface GameState {
  room: string;
  script: string;
  isStarted: boolean;
  gameStartedOn: string;
  players: Array<Player>;
}

export interface Player {
  name: string;
  socketId: string;
  role: string;
}

export interface RoomData {
  host: { clientId: string; socketId: string } | null;
  gameState: GameState;
  players: Map<string, Player>;
}

export interface PrivatePlayer {
  player: { name: string };
  role: string;
}

export interface ClientData {
  clientId: string;
  socketId: string;
  room: string;
}
