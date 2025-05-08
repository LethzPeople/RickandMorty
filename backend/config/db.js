import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    mongoose.set('debug', process.env.NODE_ENV === 'development'); 
    
    // Conexión a MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rick-and-morty-explorer');
    
    // Mensaje diferente dependiendo de si es Atlas o local
    const isAtlas = conn.connection.host.includes('mongodb.net');
    console.log(`MongoDB ${isAtlas ? 'Atlas' : 'Local'} Conectado: ${conn.connection.host}`);
    
    // Mostrar la base de datos conectada
    console.log(`Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`);
    console.error(error); 
    process.exit(1);
  }
};

