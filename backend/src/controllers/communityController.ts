import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createCommunitySchema, updateCommunitySchema, communityIdSchema, CreateCommunityInput, UpdateCommunityInput, CommunityIdInput } from '../validation/community';

export const createCommunity = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: CreateCommunityInput = createCommunitySchema.parse(req.body);

  const existingCommunity = await prisma.community.findUnique({
    where: { slug: validatedData.slug },
  });

  if (existingCommunity) {
    throw new ApiError(400, 'Community with this slug already exists');
  }

  const community = await prisma.community.create({
    data: validatedData,
  });

  res.status(201).json(new ApiResponse(201, community, 'Community created successfully'));
});

export const updateCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const validatedId: CommunityIdInput = communityIdSchema.parse({ slug });
  const validatedData: UpdateCommunityInput = updateCommunitySchema.parse(req.body);

  const community = await prisma.community.update({
    where: { slug: validatedId.slug },
    data: validatedData,
  });

  res.status(200).json(new ApiResponse(200, community, 'Community updated successfully'));
});

export const getCommunityBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const validatedId: CommunityIdInput = communityIdSchema.parse({ slug });

  const community = await prisma.community.findUnique({
    where: { slug: validatedId.slug },
    include: {
      threads: {
        include: {
          author: true,
          replies: {
            include: {
              author: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!community) {
    throw new ApiError(404, 'Community not found');
  }

  res.status(200).json(new ApiResponse(200, community, 'Community retrieved successfully'));
});

export const listCommunities = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 20, offset = 0 } = req.query;

  const communities = await prisma.community.findMany({
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.community.count();

  res.status(200).json(new ApiResponse(200, { communities, total, limit, offset }, 'Communities listed successfully'));
});