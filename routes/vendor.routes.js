import express from 'express';
import { getVendors, createVendor } from '../controllers/vendor.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getVendors);
router.post('/', authMiddleware, createVendor);

export default router;
