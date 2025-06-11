import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from 'src/auth/dto';
import { CreateTutorDto } from 'src/modules/tutores/dto/tutor.dto';

export class CreateEstudianteDto {
  @IsOptional()
  @IsInt()
  @ApiProperty()
  id?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ readOnly: true })
  codigoEstudiante?: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  nombre: string;

  @IsString()
  @MinLength(3)
  @ApiProperty()
  apellido: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  @ApiProperty({ type: () => CreateUserDto })
  user: CreateUserDto;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty()
  fechaNacimiento: Date;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  readonly genero_id: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  correoElectronico?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  direccion?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'URL de la imagen del estudiante',
    required: false,
    example: '/uploads/estudiantes/archivo.jpg',
  })
  image?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ required: false })
  tutor_id?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateTutorDto)
  @ApiProperty({ required: false, type: () => CreateTutorDto })
  tutor?: CreateTutorDto;
}

export class UpdateEstudianteDto extends PartialType(CreateEstudianteDto) {}
