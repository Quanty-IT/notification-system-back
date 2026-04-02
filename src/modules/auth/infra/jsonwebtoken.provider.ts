import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload, JwtProvider } from '../domain/jwt.provider';

export class JsonWebTokenProvider implements JwtProvider {
  constructor(
    private readonly secret: string,
    private readonly accessTokenExpiresIn: string,
    private readonly refreshTokenExpiresIn: string,
  ) {}

  async sign(payload: JwtPayload): Promise<string> {
    const options = {
      expiresIn: payload.type === 'access' ? this.accessTokenExpiresIn : this.refreshTokenExpiresIn,
    } as SignOptions;
    return jwt.sign(payload, this.secret, options);
  }

  async verify(token: string): Promise<JwtPayload> {
    const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload;

    if (!decoded.sub || !decoded.email || !decoded.type) {
      throw new Error('Token inválido');
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
      type: decoded.type,
    };
  }
}
