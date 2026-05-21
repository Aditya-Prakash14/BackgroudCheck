import { Router } from 'express';
import * as candidateController from '../controllers/candidate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', candidateController.getCandidates);
router.post('/', candidateController.createCandidate);
router.get('/:id', candidateController.getCandidateById);
router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);

export default router;
