import express from 'express';
import { 
  createCursedObject, 
  getAllCursedObjects, 
  getCursedObjectById,
  updateCursedObject,
  deleteCursedObject 
} from '../controllers/cursedObjectController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/objects - Obtener todos los objetos malditos
router.get('/', getAllCursedObjects);

// GET /api/objects/:id - Obtener un objeto maldito por ID
router.get('/:id', getCursedObjectById);

// POST /api/objects - Crear un objeto maldito (Protegido por token)
router.post('/', verifyToken, createCursedObject);

// PUT /api/objects/:id - Actualizar un objeto maldito (Protegido por token)
router.put('/:id', verifyToken, updateCursedObject);

// DELETE /api/objects/:id - Eliminar un objeto maldito (Protegido por token)
router.delete('/:id', verifyToken, deleteCursedObject);

export default router;