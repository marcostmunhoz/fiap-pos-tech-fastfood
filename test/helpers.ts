import { AppModule } from '@/app.module';
import { applyGlobalAppConfig } from '@/main.config';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type EntityArray = Array<string | Function>;

export const createApp = async (): Promise<INestApplication> => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  applyGlobalAppConfig(app);
  await app.init();

  return app;
};

export const getRandomFakeCpf = (): string => {
  const getRandomDigit = (): number => Math.floor(Math.random() * 9);

  let cpf: string = '';
  for (let i = 0; i < 9; i++) {
    cpf += getRandomDigit();
  }

  const calculateDigit = (cpf: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < cpf.length; i++) {
      total += parseInt(cpf.charAt(i)) * factor--;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateDigit(cpf, 10);
  const secondDigit = calculateDigit(cpf + firstDigit, 11);

  return cpf + firstDigit + secondDigit;
};

export class DatabaseHelper {
  private dataSource: DataSource;

  constructor(app: INestApplication) {
    this.dataSource = app.get<DataSource>(getDataSourceToken());
  }

  async emptyTables(entities: EntityArray = []): Promise<void> {
    let entitiesToBeDeleted = entities;

    if (entities.length === 0) {
      entitiesToBeDeleted = this.dataSource.entityMetadatas.map(
        (entity) => entity.name,
      );
    }

    for (const entity of entitiesToBeDeleted) {
      const repository = this.dataSource.getRepository(entity);

      await repository.clear();
    }
  }
}
