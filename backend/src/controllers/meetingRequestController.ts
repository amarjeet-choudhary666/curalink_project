import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createMeetingRequestSchema, updateMeetingRequestSchema, meetingRequestIdSchema, CreateMeetingRequestInput, UpdateMeetingRequestInput, MeetingRequestIdInput } from '../validation/meetingRequest';

export const createMeetingRequest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const validatedData: CreateMeetingRequestInput = createMeetingRequestSchema.parse(req.body);

  const recipient = await prisma.user.findUnique({
    where: { id: validatedData.recipientId },
    include: { researcher: true },
  });

  if (!recipient || recipient.role !== 'RESEARCHER') {
    throw new ApiError(400, 'Meeting requests can only be sent to researchers');
  }

  if (!recipient.researcher?.availability) {
    throw new ApiError(400, 'Researcher is not available for meetings');
  }

  // Convert scheduledFor to Date if provided
  let scheduledForDate: Date | undefined;
  if (validatedData.scheduledFor) {
    try {
      scheduledForDate = new Date(validatedData.scheduledFor);
      if (isNaN(scheduledForDate.getTime())) {
        throw new ApiError(400, 'Invalid date format for scheduledFor');
      }
    } catch (error) {
      throw new ApiError(400, 'Invalid date format for scheduledFor');
    }
  }

  if (!req.user?.id) {
    throw new ApiError(401, 'Authentication required');
  }

  const meetingRequest = await prisma.meetingRequest.create({
    data: {
      senderId: req.user.id,
      recipientId: validatedData.recipientId,
      message: validatedData.message,
      scheduledFor: scheduledForDate,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      recipient: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  res.status(201).json(new ApiResponse(201, meetingRequest, 'Meeting request created successfully'));
});

export const updateMeetingRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: MeetingRequestIdInput = meetingRequestIdSchema.parse({ id });
  const validatedData: UpdateMeetingRequestInput = updateMeetingRequestSchema.parse(req.body);

  // Convert scheduledFor to Date if provided
  let scheduledForDate: Date | undefined;
  if (validatedData.scheduledFor) {
    try {
      scheduledForDate = new Date(validatedData.scheduledFor);
      if (isNaN(scheduledForDate.getTime())) {
        throw new ApiError(400, 'Invalid date format for scheduledFor');
      }
    } catch (error) {
      throw new ApiError(400, 'Invalid date format for scheduledFor');
    }
  }

  const updateData: any = {
    message: validatedData.message,
    status: validatedData.status,
  };

  if (scheduledForDate !== undefined) {
    updateData.scheduledFor = scheduledForDate;
  }

  const meetingRequest = await prisma.meetingRequest.update({
    where: { id: validatedId.id },
    data: updateData,
    include: {
      sender: true,
      recipient: true,
    },
  });

  res.status(200).json(new ApiResponse(200, meetingRequest, 'Meeting request updated successfully'));
});

export const getMeetingRequestById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: MeetingRequestIdInput = meetingRequestIdSchema.parse({ id });

  const meetingRequest = await prisma.meetingRequest.findUnique({
    where: { id: validatedId.id },
    include: {
      sender: true,
      recipient: true,
    },
  });

  if (!meetingRequest) {
    throw new ApiError(404, 'Meeting request not found');
  }

  res.status(200).json(new ApiResponse(200, meetingRequest, 'Meeting request retrieved successfully'));
});

export const listUserMeetingRequests = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status, limit = 20, offset = 0 } = req.query;

  console.log('Fetching meeting requests for user:', userId);

  const where: any = {
    OR: [
      { senderId: userId },
      { recipientId: userId },
    ],
  };

  if (status) {
    where.status = status;
  }

  console.log('Query where clause:', JSON.stringify(where, null, 2));

  const meetingRequests = await prisma.meetingRequest.findMany({
    where,
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      recipient: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    orderBy: { createdAt: 'desc' },
  });

  console.log('Found meeting requests:', meetingRequests.length);

  const total = await prisma.meetingRequest.count({ where });

  res.status(200).json(new ApiResponse(200, { meetingRequests, total, limit, offset }, 'Meeting requests retrieved successfully'));
});

export const acceptMeetingRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: MeetingRequestIdInput = meetingRequestIdSchema.parse({ id });

  const meetingRequest = await prisma.meetingRequest.update({
    where: { id: validatedId.id },
    data: { status: 'ACCEPTED' },
    include: {
      sender: true,
      recipient: true,
    },
  });

  res.status(200).json(new ApiResponse(200, meetingRequest, 'Meeting request accepted'));
});

export const rejectMeetingRequest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: MeetingRequestIdInput = meetingRequestIdSchema.parse({ id });

  const meetingRequest = await prisma.meetingRequest.update({
    where: { id: validatedId.id },
    data: { status: 'REJECTED' },
    include: {
      sender: true,
      recipient: true,
    },
  });

  res.status(200).json(new ApiResponse(200, meetingRequest, 'Meeting request rejected'));
});

// Test endpoint to create sample data
export const createTestMeetingRequest = asyncHandler(async (_req: Request, res: Response) => {
  // This is just for testing - create a sample meeting request
  const users = await prisma.user.findMany({
    take: 2,
    include: {
      researcher: true,
    },
  });

  if (users.length < 2) {
    throw new ApiError(400, 'Need at least 2 users to create test meeting request');
  }

  const patient = users.find(u => u.role === 'PATIENT');
  const researcher = users.find(u => u.role === 'RESEARCHER');

  if (!patient || !researcher) {
    throw new ApiError(400, 'Need both patient and researcher users');
  }

  const testRequest = await prisma.meetingRequest.create({
    data: {
      senderId: patient.id,
      recipientId: researcher.id,
      message: 'Test meeting request for debugging',
      status: 'PENDING',
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      recipient: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  res.status(201).json(new ApiResponse(201, testRequest, 'Test meeting request created'));
});