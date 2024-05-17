import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomers1715900327981 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE customers (
        id VARCHAR(36) NOT NULL,
        name VARCHAR(100) NULL,
        email VARCHAR(255) NULL,
        cpf VARCHAR(11) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT PK_a7a13f4cacb744524e44dfdad32 PRIMARY KEY (id)
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE customers`);
  }
}
