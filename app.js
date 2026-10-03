import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Middleware de manejo centralizado de errores
import { errorHandler } from './middleware/errorHandler.js';

// Importación de enrutadores del proyecto PhantomBids
import authRoutes from './routes/authRoutes.js';
import houseRoutes from './routes/houseRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
import betRoutes from './routes/betRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';

const app = express();

// 1. Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 2. Montaje de rutas principales del API
app.use('/api/auth', authRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/rankings', rankingRoutes);

// Ruta base de chequeo de estado
app.get('/', (req, res) => {
  res.json({ mensaje: '👻 PhantomBids API activa y lista para subastas oscuras.' });
});

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PhantomBids API',
      version: '1.0.0',
      description: 'Documentación oficial del backend para PhantomBids',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 3. Middleware centralizado de errores (siempre al final)
app.use(errorHandler);

export default app;