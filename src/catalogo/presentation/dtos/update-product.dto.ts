import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @IsUUID()
  categoriaId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nome: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descricao: string | null;

  @IsNumber()
  @Min(0.01)
  preco: number;
}
