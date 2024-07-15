import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('load')
@ApiExcludeController()
export class LoadController {
  @Get('/')
  @HttpCode(200)
  async execute(@Query('level') level: number = 50): Promise<string> {
    const n = Math.min(level, 50);

    return `fib(${n}): ${this.fibonacci(n)}`;
  }

  private fibonacci(n: number): number {
    if (n <= 1) {
      return n;
    }

    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
