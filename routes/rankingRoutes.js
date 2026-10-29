import { Router } from 'express';
import { getHouseRankings } from '../controllers/rankingController.js';

const router = Router();

router.get('/house/:houseId', getHouseRankings);

export default router;