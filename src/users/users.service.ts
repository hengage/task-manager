import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserDocument } from './users.interface';
import { CreateUserDTO } from './dto/user,dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<IUserDocument>) {}

  async register(creatUserDTO: CreateUserDTO): Promise<Partial<IUserDocument>> {
    const userExists = await this.userModel
      .findOne({
        email: creatUserDTO.email,
      })
      .select('email')
      .lean();

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.create(creatUserDTO);
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
