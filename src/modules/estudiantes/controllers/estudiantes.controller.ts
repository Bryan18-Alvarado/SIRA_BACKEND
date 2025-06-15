import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EstudiantesService } from '../services/estudiantes.service';
import {
  CreateEstudianteDto,
  UpdateEstudianteDto,
} from '../dto/estudiantes.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('estudiantes')
export class EstudiantesController {
  constructor(private readonly estudianteService: EstudiantesService) {}

  @Get()
  getEstudiantesAll(@Query() paginationDto: PaginationDto): Promise<any> {
    return this.estudianteService.findAll(paginationDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/estudiantes',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Imagen subida correctamente',
      filePath: `/uploads/estudiantes/${file.filename}`,
    };
  }

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/estudiantes',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 30 * 1024 * 1538, // ~10MB
      },
    }),
  )
  async createEstudiante(
    @Body() createEstudianteDto: CreateEstudianteDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const imagePath = file
      ? `${req.protocol}://${req.get('host')}/uploads/estudiantes/${file.filename}`
      : undefined;

    const nuevo = await this.estudianteService.create(
      createEstudianteDto,
      user,
      imagePath,
    );

    return {
      data: nuevo,
      message: 'Estudiante creado correctamente',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const rows = await this.estudianteService.findOne(id);
    const data = {
      data: rows,
    };
    return data;
  }

  @Get(':id/calificacion')
  async findCalificacionesByEstudiante(@Param('id') id: number) {
    const rows =
      await this.estudianteService.findCalificacionesByEstudiante(id);
    const data = {
      data: rows,
    };
    return data;
  }

  @Put(':id/upload-image')
  @Auth(ValidRoles.admin, ValidRoles.estudiante)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/estudiantes',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateEstudianteImage(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Debe proporcionar una imagen');
    }

    const imagePath = `/uploads/estudiantes/${file.filename}`;
    const datos = await this.estudianteService.updateEstudianteImage(
      id,
      imagePath,
    );

    return {
      data: datos,
      message: 'Imagen actualizada correctamente',
    };
  }

  @Put(':id')
  @Auth(ValidRoles.estudiante, ValidRoles.admin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/estudiantes',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() updateEstudianteDto: UpdateEstudianteDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file
      ? `/uploads/estudiantes/${file.filename}`
      : undefined;

    const rows = await this.estudianteService.update(id, {
      ...updateEstudianteDto,
      image: imagePath,
    });

    const data = {
      data: rows,
      message: 'Estudiante actualizado correctamente',
    };
    return data;
  }

  @Get('usuario/:userId')
  async findByUserId(@Param('userId') userId: number) {
    const estudiante = await this.estudianteService.findByUserId(userId);
    return { data: estudiante };
  }
  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id') id: number) {
    const dato = await this.estudianteService.remove(id);
    const data = {
      data: dato,
      message: 'Estudiante eliminado correctamente',
    };
    return data;
  }
}
