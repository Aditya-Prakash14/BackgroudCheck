import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../prisma/client';
import * as reportService from '../services/report.service';

export const downloadReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Fetch candidate name first for elegant filename
    const candidate = await prisma.candidate.findFirst({
      where: { id, createdById: userId },
      select: { fullName: true }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    try {
      const pdfBuffer = await reportService.generateReport(id, userId);

      const safeFilename = candidate.fullName
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=BGV_Report_${safeFilename}.pdf`
      );
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (reportError: any) {
      console.error('Report generation error:', reportError);
      if (reportError.status) {
        return res.status(reportError.status).json({ error: reportError.message });
      }
      throw reportError;
    }
  } catch (error) {
    next(error);
  }
};
