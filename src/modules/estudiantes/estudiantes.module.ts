import { Module } from '@nestjs/common';
import { EstudiantesController } from './controllers/estudiantes.controller';
import { EstudiantesService } from './services/estudiantes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from './entities/estudiante.entity'; // Importamos la entidad Estudiante

@Module({
  imports: [TypeOrmModule.forFeature([Estudiante])], // Importamos el módulo TypeOrmModule y registramos la entidad Estudiante
  controllers: [EstudiantesController],
  providers: [EstudiantesService],
  exports: [TypeOrmModule, EstudiantesService], // Exportamos el servicio para que pueda ser utilizado en otros módulos
})
export class EstudiantesModule {}
