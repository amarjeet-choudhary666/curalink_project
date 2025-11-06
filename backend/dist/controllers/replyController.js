"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRepliesByPost = exports.getReplyById = exports.updateReply = exports.createReply = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const reply_1 = require("../validation/reply");
exports.createReply = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = reply_1.createReplySchema.parse(req.body);
    // Get the authenticated user ID from the request
    const authorId = req.user?.id;
    if (!authorId) {
        throw new apiError_1.ApiError(401, 'Authentication required to create replies');
    }
    // Verify the user exists and get their role
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: authorId },
    });
    if (!user) {
        throw new apiError_1.ApiError(404, 'User not found');
    }
    // Allow both patients and researchers to reply
    if (user.role !== 'RESEARCHER' && user.role !== 'PATIENT') {
        throw new apiError_1.ApiError(403, 'Only patients and researchers can reply to posts');
    }
    console.log('Creating reply with authorId:', authorId);
    console.log('Reply data:', validatedData);
    try {
        const reply = await prisma_1.prisma.reply.create({
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
        res.status(201).json(new apiResponse_1.ApiResponse(201, reply, 'Reply created successfully'));
    }
    catch (error) {
        console.error('Database error creating reply:', error);
        if (error.code === 'P2003') {
            // Foreign key constraint violation
            if (error.meta?.constraint === 'Reply_authorId_fkey') {
                throw new apiError_1.ApiError(400, 'Invalid author ID. User not found.');
            }
            else if (error.meta?.constraint === 'Reply_postId_fkey') {
                throw new apiError_1.ApiError(400, 'Invalid post ID. Post not found.');
            }
        }
        throw new apiError_1.ApiError(500, 'Database operation failed');
    }
});
exports.updateReply = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = reply_1.replyIdSchema.parse({ id });
    const validatedData = reply_1.updateReplySchema.parse(req.body);
    const reply = await prisma_1.prisma.reply.update({
        where: { id: validatedId.id },
        data: validatedData,
        include: {
            author: true,
            post: true,
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, reply, 'Reply updated successfully'));
});
exports.getReplyById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = reply_1.replyIdSchema.parse({ id });
    const reply = await prisma_1.prisma.reply.findUnique({
        where: { id: validatedId.id },
        include: {
            author: true,
            post: true,
        },
    });
    if (!reply) {
        throw new apiError_1.ApiError(404, 'Reply not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, reply, 'Reply retrieved successfully'));
});
exports.listRepliesByPost = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { postId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    const replies = await prisma_1.prisma.reply.findMany({
        where: { postId },
        include: {
            author: true,
            post: true,
        },
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'asc' },
    });
    const total = await prisma_1.prisma.reply.count({ where: { postId } });
    res.status(200).json(new apiResponse_1.ApiResponse(200, { replies, total, limit, offset }, 'Replies retrieved successfully'));
});
//# sourceMappingURL=replyController.js.map