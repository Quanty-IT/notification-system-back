export type JwtPayload = {
  sub: string;
  email: string;
};

export interface JwtProvider {
  sign(payload: JwtPayload): Promise<string>;
}
