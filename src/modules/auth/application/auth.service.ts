import createHttpError from 'http-errors';
import { HashProvider } from '@/infra/cryptography/hash.provider';
import { UserRepository } from '@/modules/users/domain/user.repository';
import { JwtPayload, JwtProvider } from '../domain/jwt.provider';
import { AuthInput, AuthOutput } from './auth.dto';

export class AuthService {
  constructor(
    private readonly repository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async signIn({ email, password }: AuthInput): Promise<AuthOutput> {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw createHttpError.Unauthorized('Credenciais inválidas');
    }

    const passwordMatches = await this.hashProvider.compare(password, user.password);

    if (!passwordMatches) {
      throw createHttpError.Unauthorized('Credenciais inválidas');
    }

    const accessToken = await this.jwtProvider.sign({
      sub: user.id,
      email: user.email,
      type: 'access',
    });

    const refreshToken = await this.jwtProvider.sign({
      sub: user.id,
      email: user.email,
      type: 'refresh',
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<AuthOutput> {
    let payload: JwtPayload;

    try {
      payload = await this.jwtProvider.verify(refreshToken);
    } catch (_error) {
      throw createHttpError.Unauthorized('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw createHttpError.Unauthorized('Invalid token type');
    }

    const user = await this.repository.findById(payload.sub);
    if (!user) {
      throw createHttpError.Unauthorized('Invalid refresh token');
    }

    const newAccessToken = await this.jwtProvider.sign({
      sub: user.id,
      email: user.email,
      type: 'access',
    });

    const newRefreshToken = await this.jwtProvider.sign({
      sub: user.id,
      email: user.email,
      type: 'refresh',
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
