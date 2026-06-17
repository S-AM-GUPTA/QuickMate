import { IsString, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  identifier: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class LoginDto {
  @IsString()
  identifier: string;

  @IsString()
  @IsOptional()
  password?: string;
}
