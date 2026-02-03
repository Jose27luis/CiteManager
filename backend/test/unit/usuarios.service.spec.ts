import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from '../../src/usuarios/usuarios.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Rol } from '@prisma/client';

jest.mock('bcrypt');

describe('UsuariosService', () => {
  let service: UsuariosService;
  let prisma: PrismaService;

  const mockUser = {
    id: 1,
    email: 'new@test.com',
    password: 'hashedPassword',
    nombre: 'New',
    apellido: 'User',
    rol: Rol.ADMIN,
    activo: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    prisma = module.get<PrismaService>(PrismaService);
    
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear un nuevo usuario con contraseña hasheada', async () => {
      jest.spyOn(prisma.usuario, 'findUnique' as any).mockResolvedValue(null);
      jest.spyOn(prisma.usuario, 'create' as any).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const dto = {
        email: 'new@test.com',
        password: 'password123',
        nombre: 'New',
        apellido: 'User',
        rol: Rol.ADMIN,
      };

      const result = await service.create(dto);

      expect(result).toEqual(mockUser);
      expect(prisma.usuario.create).toHaveBeenCalled();
    });

    it('debe lanzar ConflictException si el email ya existe', async () => {
      jest.spyOn(prisma.usuario, 'findUnique' as any).mockResolvedValue(mockUser);

      const dto = {
        email: 'new@test.com',
        password: 'password123',
        nombre: 'New',
        apellido: 'User',
        rol: Rol.ADMIN,
      };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('debe retornar un usuario por ID sin la contraseña', async () => {
      jest.spyOn(prisma.usuario, 'findUnique' as any).mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(1);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      jest.spyOn(prisma.usuario, 'findUnique' as any).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
