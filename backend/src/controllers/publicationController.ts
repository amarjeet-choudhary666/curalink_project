import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createPublicationSchema, updatePublicationSchema, publicationIdSchema, CreatePublicationInput, UpdatePublicationInput, PublicationIdInput } from '../validation/publication';
import { generateSummary } from '../utils/gemini';

export const createPublication = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: CreatePublicationInput = createPublicationSchema.parse(req.body);

  const publication = await prisma.publication.create({
    data: validatedData,
  });

  // Generate AI summary if not provided
  if (!publication.abstract && publication.title) {
    const summary = await generateSummary(`Summarize this publication: ${publication.title}`);
    await prisma.publication.update({
      where: { id: publication.id },
      data: { abstract: summary },
    });
    publication.abstract = summary;
  }

  res.status(201).json(new ApiResponse(201, publication, 'Publication created successfully'));
});

export const updatePublication = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: PublicationIdInput = publicationIdSchema.parse({ id });
  const validatedData: UpdatePublicationInput = updatePublicationSchema.parse(req.body);

  const publication = await prisma.publication.update({
    where: { id: validatedId.id },
    data: validatedData,
  });

  res.status(200).json(new ApiResponse(200, publication, 'Publication updated successfully'));
});

export const getPublicationById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: PublicationIdInput = publicationIdSchema.parse({ id });

  const publication = await prisma.publication.findUnique({
    where: { id: validatedId.id },
    include: {
      researcher: {
        include: {
          user: true,
        },
      },
      favorites: true,
    },
  });

  if (!publication) {
    throw new ApiError(404, 'Publication not found');
  }

  res.status(200).json(new ApiResponse(200, publication, 'Publication retrieved successfully'));
});

export const searchPublications = asyncHandler(async (req: Request, res: Response) => {
  const { q, journal, type, year, limit = 20, offset = 0 } = req.query;

  const where: any = {};

  if (q) {
    where.OR = [
      { title: { contains: q as string, mode: 'insensitive' } },
      { abstract: { contains: q as string, mode: 'insensitive' } },
      { authors: { hasSome: [q as string] } },
    ];
  }

  if (journal) {
    where.journal = { contains: journal as string, mode: 'insensitive' };
  }

  if (type) {
    where.type = type;
  }

  if (year) {
    where.year = parseInt(year as string);
  }

  const publications = await prisma.publication.findMany({
    where,
    include: {
      researcher: {
        include: {
          user: true,
        },
      },
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { year: 'desc' },
  });

  const total = await prisma.publication.count({ where });

  res.status(200).json(new ApiResponse(200, { publications, total, limit, offset }, 'Publications retrieved successfully'));
});

export const listPublications = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 20, offset = 0 } = req.query;

  const publications = await prisma.publication.findMany({
    include: {
      researcher: {
        include: {
          user: true,
        },
      },
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { year: 'desc' },
  });

  const total = await prisma.publication.count();

  res.status(200).json(new ApiResponse(200, { publications, total, limit, offset }, 'Publications listed successfully'));
});