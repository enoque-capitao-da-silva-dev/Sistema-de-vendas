import { IsInt, IsNotEmpty, IsString, Min, MaxLength } from 'class-validator';

export class AdjustStockDto {
  @IsInt()
  @Min(0)
  quantidadeReal: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  motivo: string;
}
