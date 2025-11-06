"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPublications = exports.listResearchers = exports.getResearcherProfile = exports.updateResearcherProfile = exports.createResearcherProfile = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const researcherProfile_1 = require("../validation/researcherProfile");
exports.createResearcherProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = researcherProfile_1.createResearcherProfileSchema.parse(req.body);
    const existingProfile = await prisma_1.prisma.researcherProfile.findUnique({
        where: { userId: validatedData.userId },
    });
    if (existingProfile) {
        throw new apiError_1.ApiError(400, 'Researcher profile already exists for this user');
    }
    const profile = await prisma_1.prisma.researcherProfile.create({
        data: validatedData,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, profile, 'Researcher profile created successfully'));
});
exports.updateResearcherProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const validatedData = researcherProfile_1.updateResearcherProfileSchema.parse(req.body);
    const profile = await prisma_1.prisma.researcherProfile.update({
        where: { userId },
        data: validatedData,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, profile, 'Researcher profile updated successfully'));
});
exports.getResearcherProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    // First, verify that the user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new apiError_1.ApiError(404, 'User not found');
    }
    let profile = await prisma_1.prisma.researcherProfile.findUnique({
        where: { userId },
        include: {
            publications: true,
            trials: true,
        },
    });
    // If profile doesn't exist, create a basic one
    if (!profile) {
        profile = await prisma_1.prisma.researcherProfile.create({
            data: {
                userId,
                specialties: [],
                interests: [],
                availability: true,
            },
            include: {
                publications: true,
                trials: true,
            },
        });
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, profile, 'Researcher profile retrieved successfully'));
});
exports.listResearchers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { specialty, location, availability, search, limit = '20', offset = '0' } = req.query;
    const where = {};
    // Filter by specialty
    if (specialty) {
        where.specialties = {
            has: specialty,
        };
    }
    // Filter by availability
    if (availability === 'true') {
        where.availability = true;
    }
    // Build user filter for search and location
    if (search || location) {
        where.user = {};
        if (search) {
            where.user.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (location) {
            where.user.location = { contains: location, mode: 'insensitive' };
        }
    }
    const researchers = await prisma_1.prisma.researcherProfile.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    bio: true,
                    location: true,
                    role: true,
                },
            },
        },
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: {
            user: {
                name: 'asc',
            },
        },
    });
    const total = await prisma_1.prisma.researcherProfile.count({
        where,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, {
        researchers,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
    }, 'Researchers retrieved successfully'));
});
exports.importPublications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const { orcid, researchgate } = req.body;
    const profile = await prisma_1.prisma.researcherProfile.findUnique({
        where: { userId },
    });
    if (!profile) {
        throw new apiError_1.ApiError(404, 'Researcher profile not found');
    }
    const updatedProfile = await prisma_1.prisma.researcherProfile.update({
        where: { userId },
        data: {
            orcid,
            researchgate,
            meta: {
                ...(profile.meta || {}),
                importStatus: 'pending',
            },
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, updatedProfile, 'Publication import initiated'));
});
//# sourceMappingURL=researcherProfileController.js.map