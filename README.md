# ReUC - Repositorio de gestion de problematicas
Repositorio para el desarrollo de un sistema de registro, gestión y seguimiento de problemáticas en el sector productivo. Este proyecto busca optimizar la identificación y resolución de desafíos mediante una plataforma eficiente y accesible

Para configurar el proyecto **ReUC** en tu máquina, sigue estas instrucciones basadas en la estructura de monorepo y las tecnologías detectadas en el repositorio.

## Requisitos previos

* **Node.js**: Versión LTS recomendada.
* **pnpm**: Versión 10.7.1 (instalable vía `npm install -g pnpm`).
* **PostgreSQL**: Base de datos para el entorno de desarrollo y despliegue.
* **Expo CLI**: Para la ejecución de la aplicación móvil.

## Configuración del Entorno (`.env`)

Debes crear dos archivos de configuración para que el sistema funcione correctamente:

### 1. API (`apps/api/.env`)

Este archivo es crítico para el servidor Express y la gestión de sesiones JWT:

```env
# Configuración del Servidor
PORT=3000
HOST=0.0.0.0
CORS_ORIGIN=*

# Seguridad JWT
JWT_SECRET=tu_secreto_para_access_token
JWT_REFRESH_SECRET=tu_secreto_para_refresh_token

# Tiempos de Expiración
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
REFRESH_TOKEN_EXPIRES_INT=604800000  # 7 días en milisegundos (usado para cookies)

```

*Nota: Es importante notar que `REFRESH_TOKEN_EXPIRES` se usa como string para la firma de JWT, mientras que `REFRESH_TOKEN_EXPIRES_INT` es el valor numérico en milisegundos para la propiedad `maxAge` de la cookie.*

### 2. Infraestructura (`packages/infrastructure/.env`)

Necesario para la conexión de Prisma con la base de datos:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/reuc_db"

```

## Pasos para la Instalación

1. **Instalar dependencias globales**:
```bash
pnpm install

```


2. **Configurar la base de datos**:
Genera el cliente de Prisma y aplica las migraciones:
```bash
cd packages/infrastructure
pnpm prisma migrate dev
pnpm prisma generate

```


3. **Poblar la base de datos (Opcional)**:
```bash
node seed.js

```



## Ejecución del Proyecto

Desde la raíz del repositorio, puedes iniciar los diferentes servicios:

* **Servidor API**: `pnpm dev:api`.
* **Aplicación Web**: `pnpm dev:web`.
* **Aplicación Móvil**:
```bash
cd apps/mobile
pnpm start

```


## Documentacion
[Google Docs](https://docs.google.com/document/d/12NVU3IfkLUACj4l16kEGhn32uZBqzXSqSV7Z8UVP1pM/edit?tab=t.0)
