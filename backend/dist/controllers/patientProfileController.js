"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientProfile = exports.updatePatientProfile = exports.createPatientProfile = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const patientProfile_1 = require("../validation/patientProfile");
exports.createPatientProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = patientProfile_1.createPatientProfileSchema.parse(req.body);
    // First, verify that the user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: validatedData.userId },
    });
    if (!user) {
        throw new apiError_1.ApiError(404, 'User not found');
    }
    const existingProfile = await prisma_1.prisma.patientProfile.findUnique({
        where: { userId: validatedData.userId },
    });
    if (existingProfile) {
        throw new apiError_1.ApiError(400, 'Patient profile already exists for this user');
    }
    const profile = await prisma_1.prisma.patientProfile.create({
        data: validatedData,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, profile, 'Patient profile created successfully'));
});
exports.updatePatientProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const validatedData = patientProfile_1.updatePatientProfileSchema.parse(req.body);
    // First, verify that the user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new apiError_1.ApiError(404, 'User not found');
    }
    // Check if profile exists, if not create it
    const existingProfile = await prisma_1.prisma.patientProfile.findUnique({
        where: { userId },
    });
    let profile;
    if (existingProfile) {
        // Update existing profile
        profile = await prisma_1.prisma.patientProfile.update({
            where: { userId },
            data: validatedData,
        });
    }
    else {
        // Create new profile with the update data
        profile = await prisma_1.prisma.patientProfile.create({
            data: {
                userId,
                ...validatedData,
            },
        });
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, profile, 'Patient profile updated successfully'));
});
exports.getPatientProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    // First, verify that the user exists
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new apiError_1.ApiError(404, 'User not found');
    }
    let profile = await prisma_1.prisma.patientProfile.findUnique({
        where: { userId },
    });
    // If profile doesn't exist, create a basic one
    if (!profile) {
        profile = await prisma_1.prisma.patientProfile.create({
            data: {
                userId,
                conditions: [],
                preferRemote: false,
            },
        });
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, profile, 'Patient profile retrieved successfully'));
});
//# sourceMappingURL=patientProfileController.js.map