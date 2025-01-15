import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { EmailService, EmailTypes } from '../email/email.service';

import { API_RESPONSE_TYPES } from '../utility/global.types';
import { getHtml } from '../utility/hbs';
import { errorLog } from '../utility/logs';
import {
  APIResponse,
  APIResponseType,
  LoginResponse,
  LoginResponseType,
} from '../utility/res';
import { ForgotPasswordDto, SignupDto } from './dto/user.dto';
import { User } from './entities/user.entity';

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
      await this.userModel.create(createUserDto);

      this.email.sendOTP(createUserDto.fullName, createUserDto.email);

      return {
        message:
          'Congratulations! Your account has been created. Please check your email inbox and verify your email address and login',
      };
    } catch (err) {
      console.error(err);
      throw new Error('Error creating user');
    }
  }

  async login(
    email,
    password,
    resendEmailIfNotVerified,
  ): Promise<LoginResponseType | APIResponseType> {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnprocessableEntityException('Invalid email or password');
    }

    if (resendEmailIfNotVerified) {
      if (user.isEmailVerified)
        throw new UnauthorizedException(
          'Your Email address is already verified.',
          {
            description: API_RESPONSE_TYPES.EMAIL_ALREADY_VERIFIED,
          },
        );
      await this.email.sendOTP(user.fullName, user.email);
      return APIResponse(
        'Verification Link has been sent to your Email Address.',
      );
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Your Email address not verified.',
        API_RESPONSE_TYPES.EMAIL_NOT_VERIFIED,
      );
    }

    if (user.isBlocked) {
      throw new UnauthorizedException(
        'There are unsolicited issues with your account. Please contact our support team.',
        API_RESPONSE_TYPES.USER_ERROR,
      );
    }

    const jwtPayload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(jwtPayload);

    return LoginResponse('Login Successful', token, {
      fullName: user.fullName,
    });
  }

  async verifyEmail(uuid: string, type: EmailTypes): Promise<string> {
    const verifiedEmail = await this.email.verifyEmail(uuid, type);
    try {
      await this.userModel.updateOne(
        { email: verifiedEmail },
        { isEmailVerified: true },
      );
      return verifiedEmail;
    } catch (err) {
      throw new Error(err);
    }
  }

  async requestForgotPassword(email: string): Promise<boolean> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        errorLog('Forgot password requested for not existing user ' + email);
        return true;
      }
      await this.email.sendOTP(
        user.fullName,
        user.email,
        EmailTypes.FORGOT_PASSWORD,
      );

      return true;
    } catch (err) {
      throw err;
    }
  }
  async forgotPasswordForm(uuid: string) {
    return getHtml('reset-password', { uuid });
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<boolean> {
    const email = await this.verifyEmail(
      forgotPasswordDto.uuid,
      EmailTypes.FORGOT_PASSWORD,
    );

    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        errorLog('Reset password requested for not existing user ' + email);
        return true;
      }

      user.password = forgotPasswordDto.password;
      user.save();

      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}
