"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectConnection = exports.acceptConnection = exports.listUserConnections = exports.getConnectionById = exports.updateConnectionStatus = exports.createConnectionRequest = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const connection_1 = require("../validation/connection");
exports.createConnectionRequest = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = connection_1.createConnectionSchema.parse(req.body);
    const requesterId = req.user?.id; // Get from auth middleware
    if (!requesterId) {
        throw new apiError_1.ApiError(401, 'Authentication required');
    }
    // Check if users exist
    const [requester, target] = await Promise.all([
        prisma_1.prisma.user.findUnique({ where: { id: requesterId } }),
        prisma_1.prisma.user.findUnique({ where: { id: validatedData.targetId } })
    ]);
    if (!requester || !target) {
        throw new apiError_1.ApiError(404, 'User not found');
    }
    if (requesterId === validatedData.targetId) {
        throw new apiError_1.ApiError(400, 'Cannot send connection request to yourself');
    }
    const existingConnection = await prisma_1.prisma.connection.findUnique({
        where: {
            requesterId_targetId: {
                requesterId,
                targetId: validatedData.targetId,
            },
        },
    });
    if (existingConnection) {
        throw new apiError_1.ApiError(400, 'Connection request already exists');
    }
    const connection = await prisma_1.prisma.connection.create({
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
    res.status(201).json(new apiResponse_1.ApiResponse(201, connection, 'Connection request sent successfully'));
});
exports.updateConnectionStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = connection_1.connectionIdSchema.parse({ id });
    const validatedData = connection_1.updateConnectionSchema.parse(req.body);
    const connection = await prisma_1.prisma.connection.update({
        where: { id: validatedId.id },
        data: validatedData,
        include: {
            requester: true,
            target: true,
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, connection, 'Connection status updated successfully'));
});
exports.getConnectionById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = connection_1.connectionIdSchema.parse({ id });
    const connection = await prisma_1.prisma.connection.findUnique({
        where: { id: validatedId.id },
        include: {
            requester: true,
            target: true,
        },
    });
    if (!connection) {
        throw new apiError_1.ApiError(404, 'Connection not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, connection, 'Connection retrieved successfully'));
});
exports.listUserConnections = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const { status, limit = 20, offset = 0 } = req.query;
    const where = {
        OR: [
            { requesterId: userId },
            { targetId: userId },
        ],
    };
    if (status) {
        where.status = status;
    }
    const connections = await prisma_1.prisma.connection.findMany({
        where,
        include: {
            requester: true,
            target: true,
        },
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.prisma.connection.count({ where });
    res.status(200).json(new apiResponse_1.ApiResponse(200, { connections, total, limit, offset }, 'Connections retrieved successfully'));
});
exports.acceptConnection = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = connection_1.connectionIdSchema.parse({ id });
    const connection = await prisma_1.prisma.connection.update({
        where: { id: validatedId.id },
        data: { status: 'CONNECTED' },
        include: {
            requester: true,
            target: true,
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, connection, 'Connection accepted'));
});
exports.rejectConnection = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = connection_1.connectionIdSchema.parse({ id });
    const connection = await prisma_1.prisma.connection.update({
        where: { id: validatedId.id },
        data: { status: 'REJECTED' },
        include: {
            requester: true,
            target: true,
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, connection, 'Connection rejected'));
});
//# sourceMappingURL=connectionController.js.map