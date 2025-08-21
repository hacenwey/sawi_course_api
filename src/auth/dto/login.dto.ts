import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  phone!: string;

  @IsString()
  @MinLength(4)
  password!: string;
}
