import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SignupDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginResponse, LoginResponseType } from 'src/utility/res';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersAuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private email: EmailService,
  ) {}
  async signup(createUserDto: SignupDto) {
    const exist = await this.userModel.countDocuments({
      email: createUserDto.email,
    });
    if (exist > 0) {
      throw new UnprocessableEntityException('Email already exists');
    }
    try {
      // const created = await this.userModel.create(createUserDto);
      // const user = created.toObject();
      // delete user.password;
      // delete user._id;

      this.email.sendOTP(createUserDto.fullName, createUserDto.email);

      return [];
    } catch (err) {
      console.error(err);
      throw new Error('Error creating user');
    }
  }

  async login(email, password): Promise<LoginResponseType> {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnprocessableEntityException('Invalid email or password');
    }

    const jwtPayload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(jwtPayload);

    return LoginResponse('login Successful', token, {
      fullName: user.fullName,
    });
  }

  async verifyEmail(uuid: string): Promise<boolean> {
    return await this.email.verifyEmail(uuid);
  }
  async forgotPassword(id: number) {
    return `This action returns a #${id} user`;
  }
}
