import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  Min,
  ValidateNested,
  IsEnum,
} from 'class-validator';

import { PaymentMethod } from "../../domain/enums/payment-method.enum";


export class CreateSaleDto {
  @IsString()
  sessaoCaixaId: string;

  /*items: Array<{
    productId: string;
    quantity: number;
  }>;*/
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemVendaDto)
  items: ItemVendaDto[];

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

export class ItemVendaDto {
  @IsString()
  productId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}