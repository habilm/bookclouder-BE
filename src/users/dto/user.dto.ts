import {
  IsEmail,
  IsNotEmpty,
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
