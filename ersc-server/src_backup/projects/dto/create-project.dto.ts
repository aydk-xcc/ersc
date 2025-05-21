import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  entry?: string;
  
  @IsOptional()
  @IsNumber()
  all_rows?: number;

  @IsOptional()
  @IsString()
  base_dir?: string;

  @IsOptional()
  @IsNumber()
  user_id?: number;
} 