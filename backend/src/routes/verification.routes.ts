import { Router } from 'express';
import * as verificationController from '../controllers/verification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/:id/start', verificationController.startVerification);

export default router;
