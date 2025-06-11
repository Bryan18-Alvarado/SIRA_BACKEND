import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsIn(['estudiante', 'docente'])
  tipoUsuario: string;

  @ValidateIf((o) => o.tipoUsuario === 'estudiante')
  @IsString()
  codigoEstudiante: string;

  @ValidateIf((o) => o.tipoUsuario === 'docente')
  @IsString()
  codigo_laboral: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, una minúscula y un número.',
  })
  password: string;
}
