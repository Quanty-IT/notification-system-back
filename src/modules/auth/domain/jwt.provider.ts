export type JwtPayload = {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
};

export interface JwtProvider {
  sign(payload: JwtPayload): Promise<string>;
  verify(token: string): Promise<JwtPayload>;
}
