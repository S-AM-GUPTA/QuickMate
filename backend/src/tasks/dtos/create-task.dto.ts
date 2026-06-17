import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsArray,
  IsOptional,
  IsDateString,
  MinLength,
} from 'class-validator';
import { TaskUrgency } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(10)
  budget: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(TaskUrgency)
  urgency: TaskUrgency;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsDateString()
  scheduledTime: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachmentUrls?: string[];
}
