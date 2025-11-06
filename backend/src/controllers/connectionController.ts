import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createConnectionSchema, updateConnectionSchema, connectionIdSchema, CreateConnectionInput, UpdateConnectionInput, ConnectionIdInput } from '../validation/connection';

export const createConnectionRequest = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: CreateConnectionInput = createConnectionSchema.parse(req.body);
  const requesterId = (req as any).user?.id; // Get from auth middleware

  if (!requesterId) {
    throw new ApiError(401, 'Authentication required');
  }

  // Check if users exist
  const [requester, target] = await Promise.all([
    prisma.user.findUnique({ where: { id: requesterId } }),
    prisma.user.findUnique({ where: { id: validatedData.targetId } })
  ]);

  if (!requester || !target) {
    throw new ApiError(404, 'User not found');
  }

  if (requesterId === validatedData.targetId) {
    throw new ApiError(400, 'Cannot send connection request to yourself');
  }

  const existingConnection = await prisma.connection.findUnique({
    where: {
      requesterId_targetId: {
        requesterId,
        targetId: validatedData.targetId,
      },
    },
  });

  if (existingConnection) {
    throw new ApiError(400, 'Connection request already exists');
  }

  const connection = await prisma.connection.create({
    data: {
      requesterId,
      targetId: validatedData.targetId,
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      target: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  res.status(201).json(new ApiResponse(201, connection, 'Connection request sent successfully'));
});

export const updateConnectionStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: ConnectionIdInput = connectionIdSchema.parse({ id });
  const validatedData: UpdateConnectionInput = updateConnectionSchema.parse(req.body);

  const connection = await prisma.connection.update({
    where: { id: validatedId.id },
    data: validatedData,
    include: {
      requester: true,
      target: true,
    },
  });

  res.status(200).json(new ApiResponse(200, connection, 'Connection status updated successfully'));
});

export const getConnectionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: ConnectionIdInput = connectionIdSchema.parse({ id });

  const connection = await prisma.connection.findUnique({
    where: { id: validatedId.id },
    include: {
      requester: true,
      target: true,
    },
  });

  if (!connection) {
    throw new ApiError(404, 'Connection not found');
  }

  res.status(200).json(new ApiResponse(200, connection, 'Connection retrieved successfully'));
});

export const listUserConnections = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status, limit = 20, offset = 0 } = req.query;

  const where: any = {
    OR: [
      { requesterId: userId },
      { targetId: userId },
    ],
  };

  if (status) {
    where.status = status;
  }

  const connections = await prisma.connection.findMany({
    where,
    include: {
      requester: true,
      target: true,
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.connection.count({ where });

  res.status(200).json(new ApiResponse(200, { connections, total, limit, offset }, 'Connections retrieved successfully'));
});

export const acceptConnection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: ConnectionIdInput = connectionIdSchema.parse({ id });

  const connection = await prisma.connection.update({
    where: { id: validatedId.id },
    data: { status: 'CONNECTED' },
    include: {
      requester: true,
      target: true,
    },
  });

  res.status(200).json(new ApiResponse(200, connection, 'Connection accepted'));
});

export const rejectConnection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: ConnectionIdInput = connectionIdSchema.parse({ id });

  const connection = await prisma.connection.update({
    where: { id: validatedId.id },
    data: { status: 'REJECTED' },
    include: {
      requester: true,
      target: true,
    },
  });

  res.status(200).json(new ApiResponse(200, connection, 'Connection rejected'));
});