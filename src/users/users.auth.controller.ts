import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';

import { LoginDto, SignupDto, VerifyEmailDto } from './dto/user.dto';
import { UsersAuthService } from './users.auth.service';
import { APIResponse, LoginResponseType } from 'src/utility/res';
import { Request } from 'express';

@Controller('auth')
export class UsersAuthController {
  constructor(private readonly usersAuthService: UsersAuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: SignupDto) {
    return this.usersAuthService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() createUserDto: LoginDto): Promise<LoginResponseType> {
    return this.usersAuthService.login(
      createUserDto.email,
      createUserDto.password,
    );
  }

  @Get('verify-email/:uuid')
  async verifyEmail(
    @Req() req: Request,
    @Param() verifyEmailDto: VerifyEmailDto,
  ) {
    const requestType =
      req.headers['content-type']?.includes('application/json');
    try {
      const verified = await this.usersAuthService.verifyEmail(
        verifyEmailDto.uuid,
      );

      if (verified) {
        return requestType ? APIResponse('Email Verified') : 'Email Verified';
      }
    } catch (err) {
      console.error(err);
      if (requestType) {
        throw err;
      } else {
        return err.message;
      }
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersAuthService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersAuthService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersAuthService.remove(+id);
  // }
}
