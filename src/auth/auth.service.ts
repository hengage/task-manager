import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

/**
 * Service responsible for authentication-related operations.
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user using their email and password.
   * @param loginDTO - Data transfer object containing login credentials.
   * @returns An object containing user details and an access token if authentication is successful.
   * @throws HttpException if login credentials are invalid.
   */
  async login(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;

    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        _id: user._id,
        email: user.email,
        accessToken: await this.jwtService.signAsync({
          _id: user._id,
          email: user.email,
        }),
      };
    } else {
      //   throw new UnauthorizedException();
      throw new HttpException(
        'Invalid login credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
