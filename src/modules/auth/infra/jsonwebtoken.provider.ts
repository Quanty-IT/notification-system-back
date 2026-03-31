import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload, JwtProvider } from '../domain/jwt.provider';

export class JsonWebTokenProvider implements JwtProvider {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  async sign(payload: JwtPayload): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as SignOptions);
  }

  async verify(token: string): Promise<JwtPayload> {
    const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload;

    return {
      sub: decoded.sub as string,
      email: decoded.email as string,
    };
  }
}
