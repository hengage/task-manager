import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
