import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { favoriteTrialSchema, favoritePublicationSchema, favoriteResearcherSchema, FavoriteTrialInput, FavoritePublicationInput, FavoriteResearcherInput } from '../validation/favorites';

export const addFavoriteTrial = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: FavoriteTrialInput = favoriteTrialSchema.parse(req.body);

  const existingFavorite = await prisma.favoriteTrial.findUnique({
    where: {
      userId_trialId: {
        userId: validatedData.userId,
        trialId: validatedData.trialId,
      },
    },
  });

  if (existingFavorite) {
    throw new ApiError(400, 'Trial already in favorites');
  }

  const favorite = await prisma.favoriteTrial.create({
    data: validatedData,
  });

  res.status(201).json(new ApiResponse(201, favorite, 'Trial added to favorites'));
});

export const removeFavoriteTrial = asyncHandler(async (req: Request, res: Response) => {
  const { userId, trialId } = req.params;

  const favorite = await prisma.favoriteTrial.findUnique({
    where: {
      userId_trialId: {
        userId,
        trialId,
      },
    },
  });

  if (!favorite) {
    throw new ApiError(404, 'Favorite not found');
  }

  await prisma.favoriteTrial.delete({
    where: {
      userId_trialId: {
        userId,
        trialId,
      },
    },
  });

  res.status(200).json(new ApiResponse(200, null, 'Trial removed from favorites'));
});

export const addFavoritePublication = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: FavoritePublicationInput = favoritePublicationSchema.parse(req.body);

  const existingFavorite = await prisma.favoritePublication.findUnique({
    where: {
      userId_publicationId: {
        userId: validatedData.userId,
        publicationId: validatedData.publicationId,
      },
    },
  });

  if (existingFavorite) {
    throw new ApiError(400, 'Publication already in favorites');
  }

  const favorite = await prisma.favoritePublication.create({
    data: validatedData,
  });

  res.status(201).json(new ApiResponse(201, favorite, 'Publication added to favorites'));
});

export const removeFavoritePublication = asyncHandler(async (req: Request, res: Response) => {
  const { userId, publicationId } = req.params;

  const favorite = await prisma.favoritePublication.findUnique({
    where: {
      userId_publicationId: {
        userId,
        publicationId,
      },
    },
  });

  if (!favorite) {
    throw new ApiError(404, 'Favorite not found');
  }

  await prisma.favoritePublication.delete({
    where: {
      userId_publicationId: {
        userId,
        publicationId,
      },
    },
  });

  res.status(200).json(new ApiResponse(200, null, 'Publication removed from favorites'));
});

export const addFavoriteResearcher = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: FavoriteResearcherInput = favoriteResearcherSchema.parse(req.body);

  const existingFavorite = await prisma.favoriteResearcher.findUnique({
    where: {
      userId_researcherId: {
        userId: validatedData.userId,
        researcherId: validatedData.researcherId,
      },
    },
  });

  if (existingFavorite) {
    throw new ApiError(400, 'Researcher already in favorites');
  }

  const favorite = await prisma.favoriteResearcher.create({
    data: validatedData,
  });

  res.status(201).json(new ApiResponse(201, favorite, 'Researcher added to favorites'));
});

export const removeFavoriteResearcher = asyncHandler(async (req: Request, res: Response) => {
  const { userId, researcherId } = req.params;

  const favorite = await prisma.favoriteResearcher.findUnique({
    where: {
      userId_researcherId: {
        userId,
        researcherId,
      },
    },
  });

  if (!favorite) {
    throw new ApiError(404, 'Favorite not found');
  }

  await prisma.favoriteResearcher.delete({
    where: {
      userId_researcherId: {
        userId,
        researcherId,
      },
    },
  });

  res.status(200).json(new ApiResponse(200, null, 'Researcher removed from favorites'));
});

export const getUserFavorites = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const [favoriteTrials, favoritePublications, favoriteResearchers] = await Promise.all([
    prisma.favoriteTrial.findMany({
      where: { userId },
      include: {
        trial: {
          include: {
            owner: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    }),
    prisma.favoritePublication.findMany({
      where: { userId },
      include: {
        publication: {
          include: {
            researcher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    }),
    prisma.favoriteResearcher.findMany({
      where: { userId },
      include: {
        researcher: {
          include: {
            user: true,
          },
        },
      },
    }),
  ]);

  res.status(200).json(new ApiResponse(200, {
    trials: favoriteTrials,
    publications: favoritePublications,
    researchers: favoriteResearchers,
  }, 'User favorites retrieved successfully'));
});