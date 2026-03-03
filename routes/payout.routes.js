import express from 'express';
import {
    getPayouts,
    getPayoutById,
    createPayout,
    submitPayout,
    approvePayout,
    rejectPayout
} from '../controllers/payout.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getPayouts);
router.get('/:id', authMiddleware, getPayoutById);

router.post('/', authMiddleware, roleMiddleware(['OPS']), createPayout);
router.post('/:id/submit', authMiddleware, roleMiddleware(['OPS']), submitPayout);

router.post('/:id/approve', authMiddleware, roleMiddleware(['FINANCE']), approvePayout);
router.post('/:id/reject', authMiddleware, roleMiddleware(['FINANCE']), rejectPayout);

export default router;
