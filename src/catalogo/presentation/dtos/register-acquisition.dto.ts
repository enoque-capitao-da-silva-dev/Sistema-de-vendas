import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterAcquisitionDto {
  //@IsUUID()
  //productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantidade: number;

  @IsOptional()
  @IsUUID()
  referenciaId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  motivo?: string | null;
}