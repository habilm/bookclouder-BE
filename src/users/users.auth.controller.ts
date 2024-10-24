import { Controller, Post, Body } from '@nestjs/common';

import { SignupDto } from './dto/user.dto';
import { UsersAuthService } from './users.auth.service';

@Controller('auth')
export class UsersAuthController {
  constructor(private readonly usersAuthService: UsersAuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: SignupDto) {
    return this.usersAuthService.signup(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersAuthService.findAll();
  // }

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
