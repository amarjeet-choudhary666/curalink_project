import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createReplySchema, updateReplySchema, replyIdSchema, CreateReplyInput, UpdateReplyInput, ReplyIdInput } from '../validation/reply';

export const createReply = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: CreateReplyInput = createReplySchema.parse(req.body);

  // Get the authenticated user ID from the request
  const authorId = (req as any).user?.id;
  
  if (!authorId) {
    throw new ApiError(401, 'Authentication required to create replies');
  }

  // Verify the user exists and get their role
  const user = await prisma.user.findUnique({
    where: { id: authorId },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Allow both patients and researchers to reply
  if (user.role !== 'RESEARCHER' && user.role !== 'PATIENT') {
    throw new ApiError(403, 'Only patients and researchers can reply to posts');
  }

  console.log('Creating reply with authorId:', authorId);
  console.log('Reply data:', validatedData);

  try {
    const reply = await prisma.reply.create({
      data: {
        ...validatedData,
        authorId,
      },
      include: {
        author: true,
        post: true,
      },
    });

    console.log('Reply created successfully:', reply.id);
    res.status(201).json(new ApiResponse(201, reply, 'Reply created successfully'));
  } catch (error: any) {
    console.error('Database error creating reply:', error);
    
    if (error.code === 'P2003') {
      // Foreign key constraint violation
      if (error.meta?.constraint === 'Reply_authorId_fkey') {
        throw new ApiError(400, 'Invalid author ID. User not found.');
      } else if (error.meta?.constraint === 'Reply_postId_fkey') {
        throw new ApiError(400, 'Invalid post ID. Post not found.');
      }
    }
    
    throw new ApiError(500, 'Database operation failed');
  }
});

export const updateReply = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: ReplyIdInput = replyIdSchema.parse({ id });
  const validatedData: UpdateReplyInput = updateReplySchema.parse(req.body);

  const reply = await prisma.reply.update({
    where: { id: validatedId.id },
    data: validatedData,
    include: {
      author: true,
      post: true,
    },
  });

  res.status(200).json(new ApiResponse(200, reply, 'Reply updated successfully'));
});

export const getReplyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: ReplyIdInput = replyIdSchema.parse({ id });

  const reply = await prisma.reply.findUnique({
    where: { id: validatedId.id },
    include: {
      author: true,
      post: true,
    },
  });

  if (!reply) {
    throw new ApiError(404, 'Reply not found');
  }

  res.status(200).json(new ApiResponse(200, reply, 'Reply retrieved successfully'));
});

export const listRepliesByPost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { limit = 20, offset = 0 } = req.query;

  const replies = await prisma.reply.findMany({
    where: { postId },
    include: {
      author: true,
      post: true,
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { createdAt: 'asc' },
  });

  const total = await prisma.reply.count({ where: { postId } });

  res.status(200).json(new ApiResponse(200, { replies, total, limit, offset }, 'Replies retrieved successfully'));
});