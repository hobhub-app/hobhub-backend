export interface TokenPayload {
  userId: number;
  email: string;
}

export interface AuthContext {
  user?: TokenPayload;
  isAuthenticated: boolean;
}
