import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createResearcherProfileSchema, updateResearcherProfileSchema, CreateResearcherProfileInput, UpdateResearcherProfileInput } from '../validation/researcherProfile';

export const createResearcherProfile = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: CreateResearcherProfileInput = createResearcherProfileSchema.parse(req.body);

  const existingProfile = await prisma.researcherProfile.findUnique({
    where: { userId: validatedData.userId },
  });

  if (existingProfile) {
    throw new ApiError(400, 'Researcher profile already exists for this user');
  }

  const profile = await prisma.researcherProfile.create({
    data: validatedData,
  });

  res.status(201).json(new ApiResponse(201, profile, 'Researcher profile created successfully'));
});

export const updateResearcherProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const validatedData: UpdateResearcherProfileInput = updateResearcherProfileSchema.parse(req.body);

  const profile = await prisma.researcherProfile.update({
    where: { userId },
    data: validatedData,
  });

  res.status(200).json(new ApiResponse(200, profile, 'Researcher profile updated successfully'));
});

export const getResearcherProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  // First, verify that the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  let profile = await prisma.researcherProfile.findUnique({
    where: { userId },
    include: {
      publications: true,
      trials: true,
    },
  });

  // If profile doesn't exist, create a basic one
  if (!profile) {
    profile = await prisma.researcherProfile.create({
      data: {
        userId,
        specialties: [],
        interests: [],
        availability: true,
      },
      include: {
        publications: true,
        trials: true,
      },
    });
  }

  res.status(200).json(new ApiResponse(200, profile, 'Researcher profile retrieved successfully'));
});

export const listResearchers = asyncHandler(async (req: Request, res: Response) => {
  const { 
    specialty, 
    location, 
    availability, 
    search, 
    limit = '20', 
    offset = '0' 
  } = req.query;

  const where: any = {};
  
  // Filter by specialty
  if (specialty) {
    where.specialties = {
      has: specialty as string,
    };
  }
  
  // Filter by availability
  if (availability === 'true') {
    where.availability = true;
  }

  // Build user filter for search and location
  if (search || location) {
    where.user = {};
    
    if (search) {
      where.user.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    
    if (location) {
      where.user.location = { contains: location as string, mode: 'insensitive' };
    }
  }

  const researchers = await prisma.researcherProfile.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          bio: true,
          location: true,
          role: true,
        },
      },
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: {
      user: {
        name: 'asc',
      },
    },
  });


  const total = await prisma.researcherProfile.count({
    where,
  });

  res.status(200).json(new ApiResponse(200, {
    researchers,
    total,
    limit: parseInt(limit as string),
    offset: parseInt(offset as string),
  }, 'Researchers retrieved successfully'));
});



export const importPublications = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { orcid, researchgate } = req.body;

  const profile = await prisma.researcherProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new ApiError(404, 'Researcher profile not found');
  }
  const updatedProfile = await prisma.researcherProfile.update({
    where: { userId },
    data: {
      orcid,
      researchgate,
      meta: {
        ...(profile.meta as object || {}),
        importStatus: 'pending',
      },
    },
  });

  res.status(200).json(new ApiResponse(200, updatedProfile, 'Publication import initiated'));
});