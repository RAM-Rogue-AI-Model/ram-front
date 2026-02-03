export interface PlayerInput {
  attack: number;
  name: string;
  pv: number;
  speed: number;
  user_id: string;
}

export interface PlayerType {
  attack: number;
  id: string;
  name: string;
  pv: number;
  speed: number;
  user_id: string;
  current_game_id?: string;
}
