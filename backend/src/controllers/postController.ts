import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createPostSchema, updatePostSchema, postIdSchema, CreatePostInput, UpdatePostInput, PostIdInput } from '../validation/post';

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: CreatePostInput = createPostSchema.parse(req.body);

  // Get the authenticated user ID from the request
  const authorId = (req as any).user?.id;
  
  if (!authorId) {
    throw new ApiError(401, 'Authentication required to create posts');
  }

  console.log('Creating post with authorId:', authorId);
  console.log('Post data:', validatedData);

  try {
    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId,
      },
      include: {
        author: true,
        community: true,
      },
    });

    console.log('Post created successfully:', post.id);
    res.status(201).json(new ApiResponse(201, post, 'Post created successfully'));
  } catch (error: any) {
    console.error('Database error creating post:', error);
    
    if (error.code === 'P2003') {
      // Foreign key constraint violation
      if (error.meta?.constraint === 'Post_authorId_fkey') {
        throw new ApiError(400, 'Invalid author ID. User not found.');
      } else if (error.meta?.constraint === 'Post_communityId_fkey') {
        throw new ApiError(400, 'Invalid community ID. Community not found.');
      }
    }
    
    throw new ApiError(500, 'Database operation failed');
  }
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: PostIdInput = postIdSchema.parse({ id });
  const validatedData: UpdatePostInput = updatePostSchema.parse(req.body);

  const post = await prisma.post.update({
    where: { id: validatedId.id },
    data: validatedData,
    include: {
      author: true,
      community: true,
    },
  });

  res.status(200).json(new ApiResponse(200, post, 'Post updated successfully'));
});

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: PostIdInput = postIdSchema.parse({ id });

  const post = await prisma.post.findUnique({
    where: { id: validatedId.id },
    include: {
      author: true,
      community: true,
      replies: {
        include: {
          author: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  res.status(200).json(new ApiResponse(200, post, 'Post retrieved successfully'));
});

export const listPostsByCommunity = asyncHandler(async (req: Request, res: Response) => {
  const { communitySlug } = req.params;
  const { limit = 20, offset = 0 } = req.query;

  const posts = await prisma.post.findMany({
    where: {
      community: {
        slug: communitySlug,
      },
    },
    include: {
      author: true,
      community: true,
      replies: {
        include: {
          author: true,
        },
      },
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.post.count({
    where: {
      community: {
        slug: communitySlug,
      },
    },
  });

  res.status(200).json(new ApiResponse(200, { posts, total, limit, offset }, 'Posts retrieved successfully'));
});

export const listAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 20, offset = 0 } = req.query;

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      community: true,
      replies: {
        include: {
          author: true,
        },
      },
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.post.count();

  res.status(200).json(new ApiResponse(200, { posts, total, limit, offset }, 'Posts retrieved successfully'));
});