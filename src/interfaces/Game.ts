import type { ItemType } from './Item';
import type { PlayerType } from './Player';

export type DungeonType = 'DUNGEON' | 'SHOP' | 'DATACENTER';

export interface GameStep {
  completed: boolean;
  date_add: Date;
  game_id: string;
  id: string;
  type: DungeonType;
}

export interface GameType {
  id: string;
  pv: number;
  playerId: string;
  consumables?: ItemType[];
  money?: number;
  ended?: boolean;
  player?: PlayerType;
  steps?: GameStep[] | null;
}

export interface EnemyType {
  id: string;
  name: string;
  pv: number;
  attack: number;
  speed: number;
  probability_attack: number;
}

export interface EffectType {
  id: string;
  stat_name: 'pv' | 'attack' | 'speed';
  count: number;
  modificator: string;
  duration: number;
}

export type ActionType = 'attack' | 'item' | 'defend';

export interface Action {
  type: ActionType;
  target_id: string;
  item_id?: string;
}

export type ActionsTour = Record<number, ActionsType>;
export type ActionsType = Record<string, Action>;

export interface BattleType {
  id: string;
  enemy: EnemyType[];
  actions: ActionsTour;
  effect: EffectType[];
  player: PlayerType;
  pv: number;
  level_dungeon: number;
  game_id: string;
  winner?: string | null;
}

export interface BattleExist extends BattleType {
  exist?: boolean | null;
}
