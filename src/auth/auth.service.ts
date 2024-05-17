import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(loginDTO: { email: string; password: string }) {
    const { email, password } = loginDTO;

    const user = await this.usersService.findByEmail(email);
    // const passwordsMatch = await bcrypt.compare(password, user.password);
    console.log({ user });
    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        _id: user._id,
        email: user.email,
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
