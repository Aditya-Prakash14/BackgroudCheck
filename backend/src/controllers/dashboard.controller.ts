import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../prisma/client';

export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    // Run queries in parallel for high performance
    const [
      total,
      verified,
      failed,
      pending,
      partial,
      recentCandidates,
    ] = await Promise.all([
      prisma.candidate.count({ where: { createdById: userId } }),
      prisma.candidate.count({ where: { createdById: userId, status: 'VERIFIED' } }),
      prisma.candidate.count({ where: { createdById: userId, status: 'FAILED' } }),
      prisma.candidate.count({ where: { createdById: userId, status: 'PENDING' } }),
      prisma.candidate.count({ where: { createdById: userId, status: 'PARTIAL' } }),
      prisma.candidate.findMany({
        where: { createdById: userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    // Build timeline chart data for the last 7 days
    const chartData = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const count = await prisma.candidate.count({
        where: {
          createdById: userId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      const dayName = startOfDay.toLocaleDateString('en-US', { weekday: 'short' });
      chartData.push({
        day: dayName,
        count,
      });
    }

    res.status(200).json({
      total,
      verified,
      failed,
      pending,
      partial,
      recentCandidates: recentCandidates.map(c => ({
        id: c.id,
        fullName: c.fullName,
        email: c.email,
        status: c.status,
        createdAt: c.createdAt,
      })),
      chartData,
    });
  } catch (error) {
    next(error);
  }
};
