import {
  IsArray,
  IsBoolean,
  IsDateString,
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
  icon: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];

  @IsNotEmpty()
  @IsDateString()
  createdAt?: string;

  @IsNotEmpty()
  @IsDateString()
  updatedAt?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
