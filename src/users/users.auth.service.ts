import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersAuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async signup(createUserDto: SignupDto) {
    console.log(createUserDto);
    try {
      await this.userModel.create(createUserDto);
    } catch (err) {
      console.error(err);
      throw new Error('Error creating user');
    }
    return 'This action adds a new user';
  }

  async login() {
    return `This action returns all users`;
  }

  async forgotPassword(id: number) {
    return `This action returns a #${id} user`;
  }
}
