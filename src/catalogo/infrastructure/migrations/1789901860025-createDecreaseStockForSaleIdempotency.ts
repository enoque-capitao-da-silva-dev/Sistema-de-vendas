import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDecreaseStockForSaleIdempotency1789901860025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE stock_movements
      ADD COLUMN decrease_stock_for_sale_idempotency_key VARCHAR(255)
      GENERATED ALWAYS AS (
        CASE
          WHEN origem = 'VENDA' AND reference_id IS NOT NULL
          THEN CONCAT('VENDA:', stock_id, ':', reference_id)
          ELSE NULL
        END
      ) STORED
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_decrease_stock_for_sale_reference
      ON stock_movements (decrease_stock_for_sale_idempotency_key)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX uq_decrease_stock_for_sale_reference
      ON stock_movements
    `);

    await queryRunner.query(`
      ALTER TABLE stock_movements
      DROP COLUMN decrease_stock_for_sale_idempotency_key
    `);
  }
}
