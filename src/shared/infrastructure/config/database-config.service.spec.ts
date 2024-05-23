import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseType } from 'typeorm';
import { DatabaseConfigService } from './database-config.service';

describe('DatabaseConfigService', () => {
  let service: DatabaseConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseConfigService>(DatabaseConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getType', () => {
    it('should return the database type', () => {
      expect(service.getType()).toBe('mysql' as DatabaseType);
    });
  });

  describe('getHost', () => {
    it('should return the database host', () => {
      const host = 'localhost';
      jest.spyOn(configService, 'get').mockReturnValue(host);

      expect(service.getHost()).toBe(host);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('MYSQL_DATABASE_HOST');
    });
  });

  describe('getPort', () => {
    it('should return the database port', () => {
      const port = 3306;
      jest.spyOn(configService, 'get').mockReturnValue(port);

      expect(service.getPort()).toBe(port);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('MYSQL_DATABASE_PORT');
    });

    it('should return the default port if the port is not a number', () => {
      jest.spyOn(configService, 'get').mockReturnValue('invalid');

      expect(service.getPort()).toBe(3306);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('MYSQL_DATABASE_PORT');
    });
  });

  describe('getUsername', () => {
    it('should return the database username', () => {
      const username = 'admin';
      jest.spyOn(configService, 'get').mockReturnValue(username);

      expect(service.getUsername()).toBe(username);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('MYSQL_DATABASE_USERNAME');
    });
  });

  describe('getPassword', () => {
    it('should return the database password', () => {
      const password = 'password';
      jest.spyOn(configService, 'get').mockReturnValue(password);

      expect(service.getPassword()).toBe(password);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('MYSQL_DATABASE_PASSWORD');
    });
  });

  describe('getDatabase', () => {
    it('should return the database name', () => {
      const database = 'mydb';
      jest.spyOn(configService, 'get').mockReturnValue(database);

      expect(service.getDatabase()).toBe(database);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('MYSQL_DATABASE_NAME');
    });
  });

  describe('getLogging', () => {
    it('should return the logging status', () => {
      const logging = true;
      jest.spyOn(configService, 'get').mockReturnValue('true');

      expect(service.getLogging()).toBe(logging);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('MYSQL_DATABASE_LOGGING');
    });
  });

  describe('getEntities', () => {
    it('should return the list of entities', () => {
      expect(service.getEntities()).toEqual([]);
    });
  });

  describe('getSynchronize', () => {
    it('should return the synchronize status', () => {
      expect(service.getSynchronize()).toBe(false);
    });
  });
});
