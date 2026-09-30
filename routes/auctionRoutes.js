import express from 'express';
import { 
  createAuction, 
  placeBid, 
  closeAuction, 
  getAuctionById 
} from '../controllers/auctionController.js';
import { 
  createCursedObject, 
  getAllCursedObjects, 
  getCursedObjectById 
} from '../controllers/cursedObjectController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- RUTAS DE OBJETOS MALDITOS ---
router.get('/objects', getAllCursedObjects);
router.get('/objects/:id', getCursedObjectById);
router.post('/objects', verifyToken, createCursedObject);

// --- RUTAS DE SUBASTAS FANTASMA ---
router.post('/', verifyToken, createAuction);
router.get('/:id', getAuctionById);
router.post('/:id/bid', verifyToken, placeBid);
router.post('/:id/close', verifyToken, closeAuction);

export default router;