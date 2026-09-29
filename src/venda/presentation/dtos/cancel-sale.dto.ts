import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsIn,
} from 'class-validator';

import { Type } from 'class-transformer';

class Actor {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsIn(['CAIXA', 'GERENTE'])
  role: 'CAIXA' | 'GERENTE';
}

export class CancelSaleDto {
  @IsString()
  @IsNotEmpty()
  saleId: string;

  @ValidateNested()
  @Type(() => Actor)
  actor: Actor;
}