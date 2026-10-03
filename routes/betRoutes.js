import { Router } from 'express';
import * as betController from '../controllers/betController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', verifyToken, betController.placeBet);
router.get('/my-bets', verifyToken, betController.getUserBets);

export default router;