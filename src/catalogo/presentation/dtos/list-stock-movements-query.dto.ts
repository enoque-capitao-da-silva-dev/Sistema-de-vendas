import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { StockMovementOrigin } from '../../domain/enums/stock-movement-origin.enum';
import { StockMovementType } from '../../domain/enums/stock-movement-type.enum';

export class ListStockMovementsQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsEnum(StockMovementType)
  tipo?: StockMovementType;

  @IsOptional()
  @IsEnum(StockMovementOrigin)
  origem?: StockMovementOrigin;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
