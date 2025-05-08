// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Conectar a la base de datos MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'https://ram404.netlify.app', 
    'http://localhost:5173'       
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas
app.use('/api', routes);

// Manejo de errores
app.use(errorHandler);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Rick and Morty Explorer' });
});

// Puerto y servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));