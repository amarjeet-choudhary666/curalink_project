"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommunities = exports.getCommunityBySlug = exports.updateCommunity = exports.createCommunity = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const community_1 = require("../validation/community");
exports.createCommunity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = community_1.createCommunitySchema.parse(req.body);
    const existingCommunity = await prisma_1.prisma.community.findUnique({
        where: { slug: validatedData.slug },
    });
    if (existingCommunity) {
        throw new apiError_1.ApiError(400, 'Community with this slug already exists');
    }
    const community = await prisma_1.prisma.community.create({
        data: validatedData,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, community, 'Community created successfully'));
});
exports.updateCommunity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    const validatedId = community_1.communityIdSchema.parse({ slug });
    const validatedData = community_1.updateCommunitySchema.parse(req.body);
    const community = await prisma_1.prisma.community.update({
        where: { slug: validatedId.slug },
        data: validatedData,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, community, 'Community updated successfully'));
});
exports.getCommunityBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { slug } = req.params;
    const validatedId = community_1.communityIdSchema.parse({ slug });
    const community = await prisma_1.prisma.community.findUnique({
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
        throw new apiError_1.ApiError(404, 'Community not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, community, 'Community retrieved successfully'));
});
exports.listCommunities = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { limit = 20, offset = 0 } = req.query;
    const communities = await prisma_1.prisma.community.findMany({
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.prisma.community.count();
    res.status(200).json(new apiResponse_1.ApiResponse(200, { communities, total, limit, offset }, 'Communities listed successfully'));
});
//# sourceMappingURL=communityController.js.map