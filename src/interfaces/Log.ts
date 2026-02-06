type ActionType = {
  INSERT: 'INSERT';
  REMOVE: 'REMOVE';
  UPDATE: 'UPDATE';
  OTHER: 'OTHER';
};

type LogLevel = {
  DEBUG: 'DEBUG';
  INFO: 'INFO';
  WARN: 'WARN';
  ERROR: 'ERROR';
};

type MicroserviceType = {
  USER: 'USER';
  EFFECT: 'EFFECT';
  BATTLE: 'BATTLE';
  LOGGER: 'LOGGER';
  PLAYER: 'PLAYER';
  ENEMY: 'ENEMY';
  GAME: 'GAME';
  ITEM: 'ITEM';
};

export interface LogsType {
  microservice: MicroserviceType;
  action: ActionType;
  level: LogLevel;
  message: string;
  timestamp?: string;
}
