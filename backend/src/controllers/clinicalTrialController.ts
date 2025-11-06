import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createClinicalTrialSchema, updateClinicalTrialSchema, trialIdSchema, CreateClinicalTrialInput, UpdateClinicalTrialInput, TrialIdInput } from '../validation/clinicalTrial';
import { generateSummary } from '../utils/gemini';

export const createClinicalTrial = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: CreateClinicalTrialInput = createClinicalTrialSchema.parse(req.body);
  const userId = (req as any).user?.id; // Get from auth middleware

  // Find the researcher profile for the authenticated user
  let ownerId = null;
  if (userId) {
    const researcherProfile = await prisma.researcherProfile.findUnique({
      where: { userId },
    });
    ownerId = researcherProfile?.id || null;
  }

  const trial = await prisma.clinicalTrial.create({
    data: {
      ...validatedData,
      ownerId,
    },
  });

  // Generate AI summary if not provided
  if (!trial.summary && trial.eligibility) {
    try {
      const summary = await generateSummary(`Summarize this clinical trial eligibility: ${trial.eligibility}`);
      await prisma.clinicalTrial.update({
        where: { id: trial.id },
        data: { summary },
      });
      trial.summary = summary;
    } catch (error) {
      console.warn('Failed to generate AI summary:', error);
      // Continue without AI summary
    }
  }

  res.status(201).json(new ApiResponse(201, trial, 'Clinical trial created successfully'));
});

export const updateClinicalTrial = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: TrialIdInput = trialIdSchema.parse({ id });
  const validatedData: UpdateClinicalTrialInput = updateClinicalTrialSchema.parse(req.body);

  const trial = await prisma.clinicalTrial.update({
    where: { id: validatedId.id },
    data: validatedData,
  });

  res.status(200).json(new ApiResponse(200, trial, 'Clinical trial updated successfully'));
});

export const getClinicalTrialById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: TrialIdInput = trialIdSchema.parse({ id });

  const trial = await prisma.clinicalTrial.findUnique({
    where: { id: validatedId.id },
    include: {
      owner: {
        include: {
          user: true,
        },
      },
      favorites: true,
    },
  });

  if (!trial) {
    throw new ApiError(404, 'Clinical trial not found');
  }

  res.status(200).json(new ApiResponse(200, trial, 'Clinical trial retrieved successfully'));
});

export const searchClinicalTrials = asyncHandler(async (req: Request, res: Response) => {
  const { q, phase, status, location, limit = 20, offset = 0 } = req.query;

  const where: any = {};

  if (q) {
    where.OR = [
      { title: { contains: q as string, mode: 'insensitive' } },
      { summary: { contains: q as string, mode: 'insensitive' } },
      { tags: { hasSome: [q as string] } },
    ];
  }

  if (phase) {
    where.phase = phase;
  }

  if (status) {
    where.status = status;
  }

  if (location) {
    where.locations = { has: location as string };
  }

  const trials = await prisma.clinicalTrial.findMany({
    where,
    include: {
      owner: {
        include: {
          user: true,
        },
      },
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.clinicalTrial.count({ where });

  res.status(200).json(new ApiResponse(200, { trials, total, limit, offset }, 'Clinical trials retrieved successfully'));
});

export const listClinicalTrials = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 20, offset = 0 } = req.query;

  const trials = await prisma.clinicalTrial.findMany({
    include: {
      owner: {
        include: {
          user: true,
        },
      },
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.clinicalTrial.count();

  res.status(200).json(new ApiResponse(200, { trials, total, limit, offset }, 'Clinical trials listed successfully'));
});