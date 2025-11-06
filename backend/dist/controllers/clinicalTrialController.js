"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listClinicalTrials = exports.searchClinicalTrials = exports.getClinicalTrialById = exports.updateClinicalTrial = exports.createClinicalTrial = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const clinicalTrial_1 = require("../validation/clinicalTrial");
const gemini_1 = require("../utils/gemini");
exports.createClinicalTrial = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = clinicalTrial_1.createClinicalTrialSchema.parse(req.body);
    const userId = req.user?.id; // Get from auth middleware
    // Find the researcher profile for the authenticated user
    let ownerId = null;
    if (userId) {
        const researcherProfile = await prisma_1.prisma.researcherProfile.findUnique({
            where: { userId },
        });
        ownerId = researcherProfile?.id || null;
    }
    const trial = await prisma_1.prisma.clinicalTrial.create({
        data: {
            ...validatedData,
            ownerId,
        },
    });
    // Generate AI summary if not provided
    if (!trial.summary && trial.eligibility) {
        try {
            const summary = await (0, gemini_1.generateSummary)(`Summarize this clinical trial eligibility: ${trial.eligibility}`);
            await prisma_1.prisma.clinicalTrial.update({
                where: { id: trial.id },
                data: { summary },
            });
            trial.summary = summary;
        }
        catch (error) {
            console.warn('Failed to generate AI summary:', error);
            // Continue without AI summary
        }
    }
    res.status(201).json(new apiResponse_1.ApiResponse(201, trial, 'Clinical trial created successfully'));
});
exports.updateClinicalTrial = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = clinicalTrial_1.trialIdSchema.parse({ id });
    const validatedData = clinicalTrial_1.updateClinicalTrialSchema.parse(req.body);
    const trial = await prisma_1.prisma.clinicalTrial.update({
        where: { id: validatedId.id },
        data: validatedData,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, trial, 'Clinical trial updated successfully'));
});
exports.getClinicalTrialById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = clinicalTrial_1.trialIdSchema.parse({ id });
    const trial = await prisma_1.prisma.clinicalTrial.findUnique({
        where: { id: validatedId.id },
        include: {
            owner: {
                include: {
                    user: true,
                },
            },
            favorites: true,
        },
    });
    if (!trial) {
        throw new apiError_1.ApiError(404, 'Clinical trial not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, trial, 'Clinical trial retrieved successfully'));
});
exports.searchClinicalTrials = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { q, phase, status, location, limit = 20, offset = 0 } = req.query;
    const where = {};
    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { summary: { contains: q, mode: 'insensitive' } },
            { tags: { hasSome: [q] } },
        ];
    }
    if (phase) {
        where.phase = phase;
    }
    if (status) {
        where.status = status;
    }
    if (location) {
        where.locations = { has: location };
    }
    const trials = await prisma_1.prisma.clinicalTrial.findMany({
        where,
        include: {
            owner: {
                include: {
                    user: true,
                },
            },
        },
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.prisma.clinicalTrial.count({ where });
    res.status(200).json(new apiResponse_1.ApiResponse(200, { trials, total, limit, offset }, 'Clinical trials retrieved successfully'));
});
exports.listClinicalTrials = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { limit = 20, offset = 0 } = req.query;
    const trials = await prisma_1.prisma.clinicalTrial.findMany({
        include: {
            owner: {
                include: {
                    user: true,
                },
            },
        },
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
    });
    const total = await prisma_1.prisma.clinicalTrial.count();
    res.status(200).json(new apiResponse_1.ApiResponse(200, { trials, total, limit, offset }, 'Clinical trials listed successfully'));
});
//# sourceMappingURL=clinicalTrialController.js.map