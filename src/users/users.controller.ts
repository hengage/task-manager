import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/user,dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async register(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.usersService.register(createUserDTO);
    return user;
  }
}
