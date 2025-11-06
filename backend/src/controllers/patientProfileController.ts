import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createPatientProfileSchema, updatePatientProfileSchema, CreatePatientProfileInput, UpdatePatientProfileInput } from '../validation/patientProfile';

export const createPatientProfile = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: CreatePatientProfileInput = createPatientProfileSchema.parse(req.body);

  // First, verify that the user exists
  const user = await prisma.user.findUnique({
    where: { id: validatedData.userId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const existingProfile = await prisma.patientProfile.findUnique({
    where: { userId: validatedData.userId },
  });

  if (existingProfile) {
    throw new ApiError(400, 'Patient profile already exists for this user');
  }

  const profile = await prisma.patientProfile.create({
    data: validatedData,
  });

  res.status(201).json(new ApiResponse(201, profile, 'Patient profile created successfully'));
});

export const updatePatientProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const validatedData: UpdatePatientProfileInput = updatePatientProfileSchema.parse(req.body);

  // First, verify that the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check if profile exists, if not create it
  const existingProfile = await prisma.patientProfile.findUnique({
    where: { userId },
  });

  let profile;
  if (existingProfile) {
    // Update existing profile
    profile = await prisma.patientProfile.update({
      where: { userId },
      data: validatedData,
    });
  } else {
    // Create new profile with the update data
    profile = await prisma.patientProfile.create({
      data: {
        userId,
        ...validatedData,
      },
    });
  }

  res.status(200).json(new ApiResponse(200, profile, 'Patient profile updated successfully'));
});

export const getPatientProfile = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  // First, verify that the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  let profile = await prisma.patientProfile.findUnique({
    where: { userId },
  });

  // If profile doesn't exist, create a basic one
  if (!profile) {
    profile = await prisma.patientProfile.create({
      data: {
        userId,
        conditions: [],
        preferRemote: false,
      },
    });
  }

  res.status(200).json(new ApiResponse(200, profile, 'Patient profile retrieved successfully'));
});