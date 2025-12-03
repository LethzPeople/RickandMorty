# Rick and Morty Explorer

Una aplicación web fullstack que permite explorar personajes de Rick and Morty, crear perfiles de usuario, y gestionar personajes personalizados.

![Rick and Morty](https://www.freepnglogos.com/uploads/rick-and-morty-png/rick-and-morty-portal-shoes-white-clothing-zavvi-23.png)

## [Link](https://ram404.netlify.app/) 

## Características

- 🔐 Autenticación de usuarios con JWT
- 👤 Sistema de perfiles de usuario 
- 📊 Exploración y búsqueda de personajes de Rick and Morty
- ✏️ Creación de personajes personalizados
- ❤️ Lista de favoritos por perfil
- 👶 Control parental para perfiles infantiles
- 🌗 Modo oscuro/claro
- 📱 Diseño responsivo

## Tecnologías utilizadas

### Frontend
- React + Vite
- TailwindCSS v4
- React Router DOM
- Axios
- React Toastify
- SweetAlert2

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para hash de contraseñas

## Requisitos previos

- Node.js (v18 o superior)
- MongoDB (local o en la nube)
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/username/rick-and-morty-explorer.git
   cd rick-and-morty-explorer
   ```

2. Configurar el backend:
   ```
   cd backend
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus datos de configuración.

3. Instalar dependencias del backend:
   ```
   npm install
   ```

4. Configurar el frontend:
   ```
   cd ../frontend
   ```

5. Instalar dependencias del frontend:
   ```
   npm install
   ```

## Ejecutar la aplicación

1. Iniciar el backend:
   ```
   cd backend
   npm run dev
   ```

2. Iniciar el frontend (en otra terminal):
   ```
   cd frontend
   npm run dev
   ```

3. Abrir en el navegador:
   ```
   http://localhost:5173
   ```

## Estructura del proyecto

- **frontend/**: Contiene la aplicación React
  - **src/**: Código fuente
    - **assets/**: Imágenes y recursos estáticos
    - **components/**: Componentes reutilizables
    - **context/**: Context API de React
    - **pages/**: Componentes de páginas
    - **services/**: Servicios para comunicación con API
    - **utils/**: Utilidades y helpers

- **backend/**: Contiene el servidor Node.js
  - **config/**: Configuración de MongoDB y JWT
  - **controllers/**: Controladores de la API
  - **middleware/**: Middleware para autenticación y roles
  - **models/**: Modelos de Mongoose
  - **routes/**: Rutas de la API

## Características de usuario

1. **Autenticación**
   - Registro y login de usuarios
   - Gestión de tokens JWT

2. **Perfiles**
   - Crear hasta 5 perfiles por cuenta
   - Perfiles para adultos y niños
   - Selección de avatar para perfil

3. **Personajes**
   - Explorar personajes de la API de Rick and Morty
   - Crear personajes personalizados
   - Buscar por nombre
   - Ver detalles completos

4. **Favoritos**
   - Añadir/quitar personajes de favoritos
   - Favoritos específicos por perfil

## Licencia

Este proyecto es para fines educativos.

## Agradecimientos

- [Rick and Morty API](https://rickandmortyapi.com/) por proporcionar los datos de personajes.