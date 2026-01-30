export interface AuthenticateResponse {
  token: string;
  user: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
}
