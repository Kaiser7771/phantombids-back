import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import houseRoutes from './routes/houseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de tu mitad
app.use('/api/auth', authRoutes);
app.use('/api/houses', houseRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API PhantomBids Backend Operativa 👻');
});

// Conexión a MongoDB Atlas y arranque del servidor
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('⚡ Conectado a MongoDB Atlas con éxito');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error.message);
  });