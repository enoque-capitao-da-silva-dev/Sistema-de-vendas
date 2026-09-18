import { MigrationInterface, QueryRunner } from 'typeorm';

export class Createproduct1789308181293 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE stock_movements
      ADD CONSTRAINT chk_stock_movement_quantity
      CHECK (quantity > 0)
    `);
  
    await queryRunner.query(`
      ALTER TABLE stock_movements
      ADD CONSTRAINT chk_stock_movement_before
      CHECK (quantity_before >= 0)
    `);
  
    await queryRunner.query(`
      ALTER TABLE stock_movements
      ADD CONSTRAINT chk_stock_movement_after
      CHECK (quantity_after >= 0)
    `);
  
    await queryRunner.query(`
      ALTER TABLE stock_movements
      ADD CONSTRAINT chk_stock_movement_calculation
      CHECK (
        (
          type = 'ENTRADA'
          AND quantity_after = quantity_before + quantity
        )
        OR
        (
          type = 'SAIDA'
          AND quantity_after = quantity_before - quantity
        )
      )
    `);
  
    await queryRunner.query(`
      ALTER TABLE stock_movements
      ADD CONSTRAINT chk_stock_movement_origin_type
      CHECK (
        (origin = 'ESTOQUE_INICIAL' AND type = 'ENTRADA')
        OR
        (origin = 'AQUISICAO' AND type = 'ENTRADA')
        OR
        (origin = 'VENDA' AND type = 'SAIDA')
        OR
        (origin = 'CANCELAMENTO_VENDA' AND type = 'ENTRADA')
        OR
        (origin = 'AJUSTE')
      )
    `);
  
    await queryRunner.query(`
      ALTER TABLE stock_movements
      ADD CONSTRAINT chk_stock_movement_reference
      CHECK (
        origin NOT IN ('VENDA', 'CANCELAMENTO_VENDA')
        OR reference_id IS NOT NULL
      )
    `);
  
    await queryRunner.query(`
      ALTER TABLE stock_movements
      ADD CONSTRAINT chk_stock_movement_reason
      CHECK (
        origin <> 'AJUSTE'
        OR (
          reason IS NOT NULL
          AND length(trim(reason)) > 0
        )
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
