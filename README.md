# 🚗 Revillot Garage — Full Stack Web App

Réplica de Romans International adaptada para **Revillot Garage**, concesionario premium en Chile.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router v6 |
| Backend | Node.js + Express |
| Base de Datos | PostgreSQL |
| Autenticación | JWT (Access Token 8h) |
| Deploy | Vercel (frontend) + Railway/Render (backend) |

## 🚀 Instalación

### 1. Pre-requisitos
- Node.js 18+
- PostgreSQL 14+ (puerto 5432)

### 2. Base de Datos
```bash
# Crear base de datos en pgAdmin o psql
CREATE DATABASE revillot_db;
```

### 3. Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

npm run db:migrate   # Crea todas las tablas
npm run db:seed      # Carga datos iniciales (30+ vehículos)
npm run dev          # Puerto 5000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev          # Puerto 5173
```

## 🔐 Credenciales Admin

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@revillotgarage.cl | admin123 |
| Vendedor | vendedor@revillotgarage.cl | seller123 |

## 📄 Páginas del Sitio

| Ruta | Descripción |
|------|-------------|
| `/` | Homepage (réplica Romans International) |
| `/inventory` | Inventario con filtros por marca y carrocería |
| `/vehicles/:id` | Detalle de vehículo con galería y formulario |
| `/sell` | Página para vender tu vehículo |
| `/insights` | Videos y artículos del blog |
| `/contact` | Formulario de contacto |
| `/admin` | Panel de administración (protegido) |

## ⚙️ Panel de Administración

- **Dashboard**: estadísticas en tiempo real
- **Vehículos**: CRUD completo con imágenes, especificaciones
- **Artículos**: blog/insights
- **Videos**: galería de YouTube
- **Leads**: gestión de consultas con seguimiento de estado

## 🌐 Variables de Entorno (Backend)

```
DATABASE_URL=postgresql://user:pass@localhost:5432/revillot_db
JWT_SECRET=tu_clave_secreta_larga
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## 📁 Estructura del Proyecto

```
revillot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/Header.jsx    ← Header transparente en homepage
│   │   │   ├── layout/Footer.jsx    ← Footer con mailing list
│   │   │   └── ui/VehicleCard.jsx   ← Tarjeta de vehículo
│   │   ├── pages/
│   │   │   ├── Home.jsx             ← Homepage réplica Romans
│   │   │   ├── Inventory.jsx        ← Inventario filtrable
│   │   │   ├── VehicleDetail.jsx    ← Detalle + formulario
│   │   │   ├── Sell.jsx             ← Vende tu auto
│   │   │   ├── Insights.jsx         ← Blog + videos
│   │   │   ├── Contact.jsx          ← Contacto
│   │   │   └── admin/               ← Panel admin
│   │   ├── services/api.js          ← Axios client
│   │   ├── context/AuthContext.jsx  ← Autenticación JWT
│   │   └── styles/main.css          ← CSS pixel-perfect
├── backend/
│   └── src/
│       ├── server.js
│       ├── routes/index.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── vehicles.controller.js
│       │   └── misc.controller.js
│       ├── middleware/auth.js
│       └── db/
│           ├── pool.js
│           ├── migrate.js            ← Crea tablas
│           └── seed.js              ← Carga 30+ vehículos reales
```
