import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskPriority } from 'src/constants';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'title is required' })
  @IsString({ message: 'title must be a string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  description: string;

  @IsOptional()
  @IsString({ message: 'priority must be a string' })
  @IsEnum(TaskPriority, {
    message: 'Priority must be one of: "low", "medium", "high"',
  })
  priority: string;

  @IsNotEmpty({ message: 'due date is required' })
  @IsDateString({}, { message: 'due date must be in valid date format' })
  dueDate: Date;
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
