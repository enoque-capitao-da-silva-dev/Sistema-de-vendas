import { IsString, IsNotEmpty } from 'class-validator';

export class ListCategoryDto {
  @IsNotEmpty()
  @IsString()
  status: string;
}