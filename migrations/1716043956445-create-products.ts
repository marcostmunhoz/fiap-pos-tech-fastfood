import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducts1716043956445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE products (
        id VARCHAR(36) NOT NULL,
        code VARCHAR(20) NOT NULL,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(10) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT products_pk_index PRIMARY KEY (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE products`);
  }
}
