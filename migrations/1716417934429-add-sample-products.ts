import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSamplePayments1716417934429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    queryRunner.query(
      `INSERT INTO products (id, code, name, description, category, price, created_at, updated_at) VALUES (
          UUID(),
          'PRD-1',
          'X-Burger',
          'Lanche composto por pão, queijo e hambúrguer',
          'food',
          1500,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-2',
          'X-Salada',
          'Lanche composto por pão, alface, tomate, queijo e hambúrguer',
          'food',
          1200,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-3',
          'X-Bacon',
          'Lanche composto por pão, alface, tomate, queijo, hambúrguer e bacon',
          'food',
          1800,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-4',
          'X-Tudo',
          'Lanche composto por pão, alface, tomate, queijo, hambúrguer, bacon, ovo e milho',
          'food',
          2000,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-5',
          'Batata Frita Pequena',
          'Porção de batata frita pequena',
          'side',
          500,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-6',
          'Batata Frita Média',
          'Porção de batata frita média',
          'side',
          800,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-7',
          'Batata Frita Grande',
          'Porção de batata frita grande',
          'side',
          1000,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-8',
          'Refrigerante 300ml',
          'Refrigerante de 300ml',
          'drink',
          300,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-9',
          'Refrigerante 500ml',
          'Refrigerante de 500ml',
          'drink',
          500,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-10',
          'Refrigerante 1L',
          'Refrigerante de 1L',
          'drink',
          800,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-11',
          'Milk shake 300ml',
          'Milk shake de 300ml',
          'dessert',
          800,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-12',
          'Milk shake 500ml',
          'Milk shake de 500ml',
          'dessert',
          1200,
          NOW(),
          NOW()
      ), (
          UUID(),
          'PRD-13',
          'Milk shake 1L',
          'Milk shake de 1L',
          'dessert',
          2000,
          NOW(),
          NOW()
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    queryRunner.query(`DELETE FROM products`);
  }
}
