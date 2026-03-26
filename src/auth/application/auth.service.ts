import { HashProvider } from "@/infra/http/cryptography/hash.provider";
import { UserRepository } from "@/users/domain/user.repository";
import { JwtProvider } from "../domain/jwt.provider";
import { AuthInput, AuthOutput } from "./auth.dto";

export class AuthService {
  constructor(
    private readonly repository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly jwtProvider: JwtProvider
  ) {}

  async signIn({ email, password }: AuthInput): Promise<AuthOutput> {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const passwordMatches = await this.hashProvider.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new Error("Credenciais inválidas");
    }

    const accessToken = await this.jwtProvider.sign({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }
}