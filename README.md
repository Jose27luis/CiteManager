# CiteManager

**Sistema de Gestion de Distribucion de Agua**

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## Descripcion

CiteManager es un sistema web integral para automatizar y gestionar los procesos operativos de empresas de distribucion de agua. Inspirado en los sistemas de empresas como **SEDAPAL** y **EMAPAT**, permite administrar clientes, medidores, lecturas, facturacion y cobranzas de manera eficiente.

---

## Caracteristicas Principales

| Modulo          | Funcionalidades                                  |
| --------------- | ------------------------------------------------ |
| **Clientes**    | Registro, gestion de predios, historial completo |
| **Medidores**   | Control de equipos, asignacion a predios         |
| **Lecturas**    | Registro mensual, calculo automatico de consumo  |
| **Facturacion** | Tarifas escalonadas, generacion automatica, PDF  |
| **Cobranzas**   | Pagos, estados de cuenta, control de morosidad   |
| **Reportes**    | Dashboard, estadisticas, exportacion de datos    |

---

## Stack Tecnologico

### Backend

- **NestJS** - Framework Node.js empresarial
- **PostgreSQL** - Base de datos relacional
- **Prisma ORM** - Mapeo objeto-relacional type-safe
- **JWT** - Autenticacion segura

### Frontend

- **Next.js 14** - Framework React con App Router
- **TailwindCSS** - Framework CSS utilitario
- **React Query** - Gestion de estado del servidor
- **React Hook Form** - Manejo de formularios

### DevOps

- **Docker** - Contenedorizacion
- **Docker Compose** - Orquestacion de servicios

---

## Estructura del Proyecto

```
CiteManager/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── prisma/         # Servicio Prisma
│   │   ├── clientes/       # Gestion de clientes
│   │   ├── predios/        # Gestion de predios
│   │   ├── medidores/      # Gestion de medidores
│   │   ├── lecturas/       # Registro de lecturas
│   │   ├── tarifas/        # Configuracion de tarifas
│   │   ├── facturas/       # Facturacion
│   │   └── pagos/          # Cobranzas
│   └── prisma/             # Schema de base de datos
│
├── frontend/               # Aplicacion Next.js (pendiente)
│
├── docker-compose.yml      # Configuracion Docker
└── README.md
```

---

## Instalacion

### Prerrequisitos

- Node.js 18+
- Docker y Docker Compose
- Git

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/Jose27luis/CiteManager.git
cd CiteManager
```

2. **Iniciar la base de datos**

```bash
docker compose up -d
```

3. **Configurar el backend**

```bash
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run start:dev
```

4. **Acceder a la aplicacion**

- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

---

## Variables de Entorno

### Backend (.env)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/citemanager"
JWT_SECRET="tu-secreto-jwt"
PORT=3001
```

---

## Formulas de Facturacion

### Calculo de Consumo

```
Consumo (m3) = Lectura Actual - Lectura Anterior
```

### Estructura de Tarifas (Configurable)

| Rango (m3) | Precio por m3 |
| ---------- | ------------- |
| 0 - 10     | S/ 1.50       |
| 11 - 25    | S/ 2.20       |
| 26 - 50    | S/ 3.50       |
| 50+        | S/ 5.00       |

### Calculo del Total

```
Subtotal = Cargo Fijo + Sumatoria(m3 x Tarifa por rango)
IGV = Subtotal x 18%
Total = Subtotal + IGV
```

---

## Scripts Disponibles

```bash
# Backend
cd backend

# Desarrollo
npm run start:dev

# Produccion
npm run build
npm run start:prod

# Base de datos
npm run db:generate    # Genera Prisma Client
npm run db:push        # Sincroniza schema con BD
npm run db:migrate     # Ejecuta migraciones
npm run db:seed        # Carga datos iniciales
npm run db:studio      # Abre Prisma Studio

# Tests
npm run test
npm run test:e2e
```

---

## API Endpoints

### Clientes

- `GET /clientes` - Listar clientes
- `GET /clientes/:id` - Obtener cliente
- `GET /clientes/:id/estado-cuenta` - Estado de cuenta
- `POST /clientes` - Crear cliente
- `PUT /clientes/:id` - Actualizar cliente
- `DELETE /clientes/:id` - Desactivar cliente

### Medidores

- `GET /medidores` - Listar medidores
- `GET /medidores/:id` - Obtener medidor
- `GET /medidores/:id/ultima-lectura` - Ultima lectura
- `POST /medidores` - Crear medidor

### Lecturas

- `GET /lecturas` - Listar lecturas
- `GET /lecturas/medidor/:id` - Lecturas por medidor
- `POST /lecturas` - Registrar lectura

### Facturas

- `GET /facturas` - Listar facturas
- `POST /facturas/generar` - Generar factura
- `POST /facturas/generar-masivo` - Generacion masiva
- `PATCH /facturas/:id/anular` - Anular factura

### Pagos

- `GET /pagos` - Listar pagos
- `GET /pagos/resumen` - Resumen de recaudacion
- `POST /pagos` - Registrar pago

---

## Licencia

Este proyecto esta bajo la Licencia MIT.

---

## Autor

**Jose Luis Teco Garcia**

- Email: jtecoluisgarciajoae@gmail.com
- GitHub: https://github.com/Jose27luis

---

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaria realizar.
