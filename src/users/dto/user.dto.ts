import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {}

export class SignupDto {
  @IsNotEmpty()
  @Matches(/^[\p{L} ]+$/u, { message: 'Please enter valid name' })
  @MaxLength(100)
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  uuid: string;
}
