// import { Auth } from 'src/auth/decorators';
import { SeedService } from './seed.service';
import { Controller, Get } from '@nestjs/common';
// import { ValidRoles } from 'src/auth/interfaces';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  //recordar agregar otro metodo para nuestros seed de las tablas
  @Get()
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
