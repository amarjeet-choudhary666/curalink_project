"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestMeetingRequest = exports.rejectMeetingRequest = exports.acceptMeetingRequest = exports.listUserMeetingRequests = exports.getMeetingRequestById = exports.updateMeetingRequest = exports.createMeetingRequest = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const meetingRequest_1 = require("../validation/meetingRequest");
exports.createMeetingRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = meetingRequest_1.createMeetingRequestSchema.parse(req.body);
    const recipient = await prisma_1.prisma.user.findUnique({
        where: { id: validatedData.recipientId },
        include: { researcher: true },
    });
    if (!recipient || recipient.role !== 'RESEARCHER') {
        throw new apiError_1.ApiError(400, 'Meeting requests can only be sent to researchers');
    }
    if (!recipient.researcher?.availability) {
        throw new apiError_1.ApiError(400, 'Researcher is not available for meetings');
    }
    // Convert scheduledFor to Date if provided
    let scheduledForDate;
    if (validatedData.scheduledFor) {
        try {
            scheduledForDate = new Date(validatedData.scheduledFor);
            if (isNaN(scheduledForDate.getTime())) {
                throw new apiError_1.ApiError(400, 'Invalid date format for scheduledFor');
            }
        }
        catch (error) {
            throw new apiError_1.ApiError(400, 'Invalid date format for scheduledFor');
        }
    }
    if (!req.user?.id) {
        throw new apiError_1.ApiError(401, 'Authentication required');
    }
    const meetingRequest = await prisma_1.prisma.meetingRequest.create({
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
    res.status(201).json(new apiResponse_1.ApiResponse(201, meetingRequest, 'Meeting request created successfully'));
});
exports.updateMeetingRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = meetingRequest_1.meetingRequestIdSchema.parse({ id });
    const validatedData = meetingRequest_1.updateMeetingRequestSchema.parse(req.body);
    // Convert scheduledFor to Date if provided
    let scheduledForDate;
    if (validatedData.scheduledFor) {
        try {
            scheduledForDate = new Date(validatedData.scheduledFor);
            if (isNaN(scheduledForDate.getTime())) {
                throw new apiError_1.ApiError(400, 'Invalid date format for scheduledFor');
            }
        }
        catch (error) {
            throw new apiError_1.ApiError(400, 'Invalid date format for scheduledFor');
        }
    }
    const updateData = {
        message: validatedData.message,
        status: validatedData.status,
    };
    if (scheduledForDate !== undefined) {
        updateData.scheduledFor = scheduledForDate;
    }
    const meetingRequest = await prisma_1.prisma.meetingRequest.update({
        where: { id: validatedId.id },
        data: updateData,
        include: {
            sender: true,
            recipient: true,
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, meetingRequest, 'Meeting request updated successfully'));
});
exports.getMeetingRequestById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = meetingRequest_1.meetingRequestIdSchema.parse({ id });
    const meetingRequest = await prisma_1.prisma.meetingRequest.findUnique({
        where: { id: validatedId.id },
        include: {
            sender: true,
            recipient: true,
        },
    });
    if (!meetingRequest) {
        throw new apiError_1.ApiError(404, 'Meeting request not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, meetingRequest, 'Meeting request retrieved successfully'));
});
exports.listUserMeetingRequests = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const { status, limit = 20, offset = 0 } = req.query;
    console.log('Fetching meeting requests for user:', userId);
    const where = {
        OR: [
            { senderId: userId },
            { recipientId: userId },
        ],
    };
    if (status) {
        where.status = status;
    }
    console.log('Query where clause:', JSON.stringify(where, null, 2));
    const meetingRequests = await prisma_1.prisma.meetingRequest.findMany({
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
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
    });
    console.log('Found meeting requests:', meetingRequests.length);
    const total = await prisma_1.prisma.meetingRequest.count({ where });
    res.status(200).json(new apiResponse_1.ApiResponse(200, { meetingRequests, total, limit, offset }, 'Meeting requests retrieved successfully'));
});
exports.acceptMeetingRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = meetingRequest_1.meetingRequestIdSchema.parse({ id });
    const meetingRequest = await prisma_1.prisma.meetingRequest.update({
        where: { id: validatedId.id },
        data: { status: 'ACCEPTED' },
        include: {
            sender: true,
            recipient: true,
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, meetingRequest, 'Meeting request accepted'));
});
exports.rejectMeetingRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = meetingRequest_1.meetingRequestIdSchema.parse({ id });
    const meetingRequest = await prisma_1.prisma.meetingRequest.update({
        where: { id: validatedId.id },
        data: { status: 'REJECTED' },
        include: {
            sender: true,
            recipient: true,
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, meetingRequest, 'Meeting request rejected'));
});
// Test endpoint to create sample data
exports.createTestMeetingRequest = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    // This is just for testing - create a sample meeting request
    const users = await prisma_1.prisma.user.findMany({
        take: 2,
        include: {
            researcher: true,
        },
    });
    if (users.length < 2) {
        throw new apiError_1.ApiError(400, 'Need at least 2 users to create test meeting request');
    }
    const patient = users.find(u => u.role === 'PATIENT');
    const researcher = users.find(u => u.role === 'RESEARCHER');
    if (!patient || !researcher) {
        throw new apiError_1.ApiError(400, 'Need both patient and researcher users');
    }
    const testRequest = await prisma_1.prisma.meetingRequest.create({
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
    res.status(201).json(new apiResponse_1.ApiResponse(201, testRequest, 'Test meeting request created'));
});
//# sourceMappingURL=meetingRequestController.js.map