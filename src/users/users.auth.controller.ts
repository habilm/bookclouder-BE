import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';

import { Request } from 'express';
import {
  APIResponse,
  APIResponseType,
  LoginResponseType,
} from '../utility/res';
import {
  ForgotPasswordDto,
  LoginDto,
  RequestForgotPasswordDto,
  SignupDto,
  VerifyEmailDto,
} from './dto/user.dto';
import { UsersAuthService } from './users.auth.service';

import { EmailTypes } from '../email/email.service';
import { isXhr } from '../utility/helper';

@Controller('auth')
export class UsersAuthController {
  constructor(private readonly usersAuthService: UsersAuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: SignupDto) {
    return this.usersAuthService.signup(createUserDto);
  }

  @Post('login/:resendEmailVerification?')
  async login(
    @Body() createUserDto: LoginDto,
    @Param('resendEmailVerification') resendEmail?: 'resend',
  ): Promise<LoginResponseType | APIResponseType> {
    return this.usersAuthService.login(
      createUserDto.email,
      createUserDto.password,
      resendEmail === 'resend',
    );
  }

  @Get('verify-email/:uuid')
  async verifyEmail(
    @Req() req: Request,
    @Param() verifyEmailDto: VerifyEmailDto,
  ) {
    const requestType = isXhr(req);
    try {
      await this.usersAuthService.verifyEmail(
        verifyEmailDto.uuid,
        EmailTypes.VERIFY_EMAIL,
      );

      const $message =
        'Email Verified, Got the extension and login with your credentials';
      return requestType ? APIResponse($message) : $message;
    } catch (err) {
      throw err;
    }
  }

  @Post('request-forgot-password')
  async requestForgotPassword(
    @Req() req: Request,
    @Body() dto: RequestForgotPasswordDto,
  ) {
    const requestType = isXhr(req);
    try {
      const sent = await this.usersAuthService.requestForgotPassword(dto.email);

      if (sent) {
        const text = 'Reset Password link has been sent';
        return requestType ? APIResponse(text) : text;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('forgot-password/:uuid')
  async forgotPasswordForm(@Param('uuid') uuid: string) {
    return await this.usersAuthService.forgotPasswordForm(uuid);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Req() req: Request,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const requestType = isXhr(req);
    try {
      const verified =
        await this.usersAuthService.forgotPassword(forgotPasswordDto);

      if (verified) {
        const message = 'Your password has been changed. Please Login';
        return requestType ? APIResponse(message) : message;
      }
    } catch (err) {
      throw err;
    }
  }
}
