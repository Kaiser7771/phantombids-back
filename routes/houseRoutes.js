import { Router } from 'express';
import * as houseController from '../controllers/houseController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', houseController.getAllHouses);
router.get('/:id', houseController.getHouseById);
router.post('/', verifyToken, houseController.createHouse);
router.post('/:id/join', verifyToken, houseController.joinHouse);
router.get('/:id/members', houseController.getHouseMembers);

export default router;