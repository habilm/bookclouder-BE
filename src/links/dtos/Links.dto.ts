import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LinkCreateDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  title: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @MaxLength(3000)
  @MinLength(10)
  url: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(3000)
  @MinLength(3)
  @IsUrl()
  icon: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
