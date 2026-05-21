import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as candidateService from '../services/candidate.service';

export const createCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { fullName, email, phone, aadhaarNumber, panNumber, dob, address } = req.body;

    // Simple validations
    if (!fullName || !email || !phone || !aadhaarNumber || !panNumber || !dob || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return res.status(400).json({ error: 'Aadhaar must be exactly 12 digits' });
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(panNumber)) {
      return res.status(400).json({ error: 'Invalid PAN format' });
    }

    const candidate = await candidateService.createCandidate(req.body, userId);
    res.status(201).json({
      message: 'Candidate created successfully',
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || '');

    const result = await candidateService.getCandidates(userId, page, limit, search);
    res.status(200).json({
      message: 'Candidates retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidateById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const candidate = await candidateService.getCandidateById(id, userId);
    res.status(200).json({
      message: 'Candidate retrieved successfully',
      data: candidate,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Simple format checks if they are provided
    if (req.body.aadhaarNumber && !/^\d{12}$/.test(req.body.aadhaarNumber)) {
      return res.status(400).json({ error: 'Aadhaar must be exactly 12 digits' });
    }

    if (req.body.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(req.body.panNumber)) {
      return res.status(400).json({ error: 'Invalid PAN format' });
    }

    const updated = await candidateService.updateCandidate(id, req.body, userId);
    res.status(200).json({
      message: 'Candidate updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCandidate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    await candidateService.deleteCandidate(id, userId);
    res.status(200).json({
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
