import { MigrationInterface, QueryRunner } from 'typeorm';

export class SaleAndSaleItem1790242929375 implements MigrationInterface {
  name = 'SaleAndSaleItem1790242929375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE sale_items (
        id varchar(255) NOT NULL, 
        sale_id varchar(255) NOT NULL,
        product_id varchar(255) NOT NULL,
        product_name varchar(150) NOT NULL, 
        unit_price_amount decimal(15,2) NOT NULL, 
        unit_price_currency varchar(3) NOT NULL, 
        quantidade int NOT NULL, 
        subtotalAmount decimal(15,2) NOT NULL, 
        PRIMARY KEY (id)
      ) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE sales (
        id varchar(255) NOT NULL, 
        session_id varchar(255) NOT NULL, 
        total_amount decimal(15,2) NOT NULL, 
        currency varchar(3) NOT NULL, 
        status varchar(20) NOT NULL, 
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        PRIMARY KEY (id)
      ) ENGINE=InnoDB`,
    );
    await queryRunner.query(`
      ALETER TABLE sale_items 
      ADD CONSTRAINT FOREIGN KEY sale_items_sale_id (sale_id) 
      REFERENCES sales(id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE sales`);
    await queryRunner.query(`DROP TABLE sale_items`);
  }
}
