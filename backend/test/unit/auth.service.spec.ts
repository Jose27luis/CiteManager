import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsuariosService } from '../../src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Rol, Usuario } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usuariosService: UsuariosService;
  let jwtService: JwtService;

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedPassword',
    nombre: 'Test',
    apellido: 'User',
    rol: Rol.ADMIN,
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuariosService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuariosService = module.get<UsuariosService>(UsuariosService);
    jwtService = module.get<JwtService>(JwtService);
    
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('debe retornar el usuario (sin password) si las credenciales son válidas', async () => {
      jest.spyOn(usuariosService, 'findByEmail').mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', 'password123');

      expect(result).toEqual({
        id: mockUsuario.id,
        email: mockUsuario.email,
        nombre: mockUsuario.nombre,
        apellido: mockUsuario.apellido,
        rol: mockUsuario.rol,
        activo: mockUsuario.activo,
        createdAt: mockUsuario.createdAt,
        updatedAt: mockUsuario.updatedAt,
      });
    });

    it('debe retornar null si la contraseña es incorrecta', async () => {
      jest.spyOn(usuariosService, 'findByEmail').mockResolvedValue(mockUsuario);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@test.com', 'wrongPass');

      expect(result).toBeNull();
    });

    it('debe retornar null si el usuario no existe', async () => {
      jest.spyOn(usuariosService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser('none@test.com', 'password123');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('debe retornar un access_token y datos del usuario', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        nombre: 'Test',
        apellido: 'User',
        rol: Rol.ADMIN,
      } as any);

      const result = await service.login({ email: 'test@test.com', password: 'password123' });

      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe('test@test.com');
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('debe lanzar UnauthorizedException si la validación falla', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login({ email: 'error@test.com', password: '123' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});
