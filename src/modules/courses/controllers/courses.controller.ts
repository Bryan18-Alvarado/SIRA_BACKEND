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
import { CoursesService } from '../services/courses.service';
import {
  CreateCoursesDto,
  FilterCoursesDto,
  UpdateCoursesDto,
} from '../dto/courses.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getFindAll(@Query() params: FilterCoursesDto) {
    const { data, total } = await this.coursesService.findAll(params);
    return { data, total };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/courses',
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
      filePath: `/uploads/courses/${file.filename}`,
    };
  }

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/courses',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 30 * 1024 * 1538, // ~30MB
      },
    }),
  )
  async createCourse(
    @Body() createCourseDto: CreateCoursesDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const imagePath = file
      ? `${req.protocol}://${req.get('host')}/uploads/courses/${file.filename}`
      : undefined;

    const nuevo = await this.coursesService.create(createCourseDto, imagePath);
    const data = {
      data: nuevo,
      message: 'Registro creado correctamente',
    };
    return data;
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const rows = await this.coursesService.findOne(id);
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
        destination: './uploads/courses',
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
    @Body() updateCoursesDto: UpdateCoursesDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `/uploads/courses/${file.filename}` : undefined;
    const datos = await this.coursesService.update(id, {
      ...updateCoursesDto,
      image: imagePath,
    });
    const data = {
      data: datos,
      message: 'Registro actualizado correctamente',
    };
    return data;
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id') id: number) {
    const datos = await this.coursesService.remove(id);
    const data = {
      data: datos,
      message: 'Registro eliminado correctamente',
    };
    return data;
  }
}
