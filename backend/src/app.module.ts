import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { PrediosModule } from './predios/predios.module';
import { MedidoresModule } from './medidores/medidores.module';
import { LecturasModule } from './lecturas/lecturas.module';
import { TarifasModule } from './tarifas/tarifas.module';
import { FacturasModule } from './facturas/facturas.module';
import { PagosModule } from './pagos/pagos.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ClientesModule,
    PrediosModule,
    MedidoresModule,
    LecturasModule,
    TarifasModule,
    FacturasModule,
    PagosModule,
    AuthModule,
    UsuariosModule,
  ],
})
export class AppModule {}
