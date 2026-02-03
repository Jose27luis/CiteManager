import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';
import * as bcrypt from 'bcrypt';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { email, password, ...rest } = createUsuarioDto;

    const existingUser = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electronico ya esta registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        ...rest,
      },
    });
  }

  async findAll(): Promise<Omit<Usuario, 'password'>[]> {
    const usuarios = await this.prisma.usuario.findMany();
    return usuarios.map((user) => {
      const { password: _, ...result } = user;
      return result;
    });
  }

  async findOne(id: number): Promise<Omit<Usuario, 'password'>> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const { password: _, ...result } = usuario;
    return result;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Omit<Usuario, 'password'>> {
    await this.findOne(id);

    const updatedUser = await this.prisma.usuario.update({
      where: { id },
      data: updateUsuarioDto,
    });

    const { password: _, ...result } = updatedUser;
    return result;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });
  }
}
