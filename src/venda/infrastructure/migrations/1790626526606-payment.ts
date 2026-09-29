import { MigrationInterface, QueryRunner } from 'typeorm';

export class Payment1790626526606 implements MigrationInterface {
  name = 'Payment1790626526606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE payments (
        id varchar(255) NOT NULL, 
        sale_id varchar(255) NOT NULL, 
        amount decimal(15,2) NOT NULL, 
        currency varchar(3) NOT NULL, 
        method varchar(30) NOT NULL, 
        status varchar(20) NOT NULL, 
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
        UNIQUE INDEX IDX_a9272c4415ef64294b104e378a (sale_id), 
        PRIMARY KEY (id),
        FOREIGN KEY payment_sale_id (sale_id) REFERENCES sales(id)
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IDX_a9272c4415ef64294b104e378a ON payments`,
    );
    await queryRunner.query(`DROP TABLE payments`);
  }
}
