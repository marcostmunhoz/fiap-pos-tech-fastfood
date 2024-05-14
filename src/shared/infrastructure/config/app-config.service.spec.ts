import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from './app-config.service';
import { ConfigService } from '@nestjs/config';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getHost', () => {
    it('should return the application host', () => {
      const host = '0.0.0.0';
      jest.spyOn(configService, 'get').mockReturnValue(host);

      expect(service.getHost()).toBe(host);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('HOST');
    });

    it('should return the default host if the host is not provided', () => {
      jest.spyOn(configService, 'get').mockReturnValue(null);

      expect(service.getHost()).toBe('localhost');
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('HOST');
    });
  });

  describe('getPort', () => {
    it('should return the application port', () => {
      const port = 8080;
      jest.spyOn(configService, 'get').mockReturnValue(port);

      expect(service.getPort()).toBe(port);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('PORT');
    });

    it('should return the default port if the port is not a number', () => {
      jest.spyOn(configService, 'get').mockReturnValue('invalid');

      expect(service.getPort()).toBe(3000);
      expect(configService.get).toHaveBeenCalledTimes(1);
      expect(configService.get).toHaveBeenCalledWith('PORT');
    });
  });
});
