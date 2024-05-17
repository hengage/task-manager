import { Body, Controller, HttpStatus, Post, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO, @Response() res) {
    const user = await this.authService.login(loginDTO);
    return res.status(HttpStatus.OK).json({
      message: 'success',
      data: user,
    });
  }
}
