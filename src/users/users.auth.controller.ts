import { Controller, Post, Body } from '@nestjs/common';

import { LoginDto, SignupDto } from './dto/user.dto';
import { UsersAuthService } from './users.auth.service';
import { LoginResponseType } from 'src/utility/res';

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
