import { IsInt, IsNotEmpty, IsString, Min, MaxLength } from 'class-validator';
import { Type } from "class-transformer";

export class AdjustStockDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantidadeReal: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  motivo: string;
}
