import {
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
import { DocentesService } from '../services/docentes.service';
import {
  CreateDocenteDto,
  FilterDocenteDto,
  UpdateDocenteDto,
} from '../dto/docente-create.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
@Controller('docentes')
export class DocentesController {
  constructor(private readonly docentesService: DocentesService) {}

  @Get()
  async getFindAll(@Query() params: FilterDocenteDto) {
    const [rows, total] = await this.docentesService.findAll(params);
    return { data: rows, total };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/docentes',
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
      filePath: `/uploads/docentes/${file.filename}`,
    };
  }
  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/docentes',
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
  async createDocente(
    @Body() createDocenteDto: CreateDocenteDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const imagePath = file
      ? `${req.protocol}://${req.get('host')}/uploads/docentes/${file.filename}`
      : undefined;

    const nuevo = await this.docentesService.create(
      createDocenteDto,
      user,
      imagePath,
    );

    return {
      data: nuevo,
      message: 'Docente creado correctamente',
    };
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const rows = await this.docentesService.findOne(id);
    const data = {
      data: rows,
    };
    return data;
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/docentes',
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
    @Body() updateDocenteDto: UpdateDocenteDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/docentes/${file.filename}` : undefined;
    const rows = await this.docentesService.update(
      id,
      { ...updateDocenteDto, image: imagePath },
      user,
    );
    const data = {
      data: rows,
      message: 'Docente actualizado correctamente',
    };
    return data;
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id') id: number) {
    const dato = await this.docentesService.remove(id);
    const data = {
      data: dato,
      message: 'Docente eliminado correctamente',
    };
    return data;
  }
}
