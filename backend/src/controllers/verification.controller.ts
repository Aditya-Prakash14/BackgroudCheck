import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as verificationService from '../services/verification.service';

export const startVerification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params; // candidateId

    const result = await verificationService.runVerification(id, userId);
    res.status(200).json({
      message: 'Verification completed',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
