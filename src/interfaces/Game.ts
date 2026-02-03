import type { PlayerType } from "./Player";

export type DungeonType = "DUNGEON" | "SHOP" | "DATACENTER"

export interface GameStep {
  completed:boolean;
  date_add:Date;
  game_id:string;
  id:string;
  type:DungeonType
}

export interface GameType {
  id:string,
  pv:number,
  playerId:string,
  consumables?: number[];
  money?: number;
  ended?: boolean;
  player?:PlayerType;
  steps?:GameStep[] | null;
}