import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class DecreaseStockForSaleDto {
  @IsString()
  saleId: string;

  /*items: Array<{
    productId: string;
    quantity: number;
  }>;*/
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemVendaDto)
  items: ItemVendaDto[];
}

export class ItemVendaDto {
  @IsString()
  productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}