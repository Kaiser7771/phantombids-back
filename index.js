import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Conectar a la base de datos e iniciar el servidor
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('⚡ Conectado a MongoDB Atlas con éxito');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  });