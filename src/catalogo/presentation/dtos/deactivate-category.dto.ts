import {
  IsNotEmpty,
  IsString
} from 'class-validator';

export class DeactivateCategoryDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}