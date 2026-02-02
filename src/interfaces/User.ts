export interface UserMeResponse {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface AuthenticateResponse {
  token: string;
  user: UserMeResponse;
}

export interface UserType {
  id: string;
  username: string;
  passwor: string;
}
