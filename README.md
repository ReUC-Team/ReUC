# ReUC - Repositorio de gestion de problematicas
Repositorio para el desarrollo de un sistema de registro, gestión y seguimiento de problemáticas en el sector productivo. Este proyecto busca optimizar la identificación y resolución de desafíos mediante una plataforma eficiente y accesible

Para configurar el proyecto **ReUC** en tu máquina, sigue estas instrucciones basadas en la estructura de monorepo y las tecnologías detectadas en el repositorio.

## Requisitos previos

Asegúrate de tener instalado lo siguiente:

* **Node.js**: Se recomienda una versión LTS reciente.
* **pnpm**: El proyecto utiliza la versión 10.7.1. Puedes instalarlo con:
```bash
npm install -g pnpm

```


* **PostgreSQL**: Es el proveedor de base de datos predeterminado.
* **Expo CLI**: Necesario para la aplicación móvil.

## Configuración General

1. **Clonar el repositorio**:
```bash
git clone <url-del-repositorio>
cd ReUC

```


2. **Instalar dependencias**:
Desde la raíz del proyecto, ejecuta:
```bash
pnpm install

```


3. **Configuración de variables de entorno**:
Crea un archivo `.env` en `packages/infrastructure/`. Como mínimo, necesitas la cadena de conexión a la base de datos:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/reuc_db"

```


4. **Configuración de la Base de Datos**:
Inicializa la base de datos y genera el cliente de Prisma:
```bash
cd packages/infrastructure
pnpm prisma migrate dev
pnpm prisma generate

```


*(Opcional)* Ejecuta el script de semilla para datos iniciales:
```bash
node seed.js

```



## Ejecución del Proyecto

El proyecto utiliza filtros de pnpm para ejecutar aplicaciones específicas desde la raíz.

* **API (Backend)**:
```bash
pnpm dev:api

```


* **Web (Frontend)**:
```bash
pnpm dev:web

```


* **Mobile (Expo)**:
```bash
cd apps/mobile
pnpm start

```
---

## Descripción de la Arquitectura

El proyecto sigue una arquitectura de capas (Dominio, Aplicación, Infraestructura y Presentación) gestionada como un monorepo mediante pnpm workspaces.

* **apps/**: Contiene los puntos de entrada para la API (Express), Web (React) y Móvil (Expo).
* **packages/**: Contiene la lógica central y la infraestructura de la base de datos.
