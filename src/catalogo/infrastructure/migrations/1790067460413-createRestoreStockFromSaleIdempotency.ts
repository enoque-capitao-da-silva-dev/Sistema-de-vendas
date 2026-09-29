import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRestoreStockFromSaleIdempotency1790067460413 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE stock_movements
      ADD COLUMN restore_stock_from_sale_idempotency_key VARCHAR(255)
      GENERATED ALWAYS AS (
        CASE
          WHEN origem = 'CANCELAMENTO_VENDA' AND reference_id IS NOT NULL
          THEN CONCAT('CANCELAMENTO_VENDA:', stock_id, ':', reference_id)
          ELSE NULL
        END
      ) STORED
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_restore_stock_from_sale_reference
      ON stock_movements (restore_stock_from_sale_idempotency_key)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX uq_restore_stock_from_sale_reference
      ON stock_movements
    `);

    await queryRunner.query(`
      ALTER TABLE stock_movements
      DROP COLUMN restore_stock_from_sale_idempotency_key
    `);
  }

}
