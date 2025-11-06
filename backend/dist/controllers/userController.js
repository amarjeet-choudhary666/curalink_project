"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.getUserById = exports.loginUser = exports.updateUser = exports.createUser = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const user_1 = require("../validation/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
exports.createUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = user_1.createUserSchema.parse(req.body);
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: validatedData.email },
    });
    if (existingUser) {
        throw new apiError_1.ApiError(400, 'User with this email already exists');
    }
    const hashedPassword = await bcryptjs_1.default.hash(validatedData.password, 10);
    const user = await prisma_1.prisma.user.create({
        data: {
            ...validatedData,
            password: hashedPassword,
        },
    });
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(new apiResponse_1.ApiResponse(201, userWithoutPassword, 'User created successfully'));
});
exports.updateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = user_1.userIdSchema.parse({ id });
    const validatedData = user_1.updateUserSchema.parse(req.body);
    const user = await prisma_1.prisma.user.update({
        where: { id: validatedId.id },
        data: validatedData,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, user, 'User updated successfully'));
});
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = user_1.loginSchema.parse(req.body);
    const user = await prisma_1.prisma.user.findUnique({
        where: { email: validatedData.email },
        include: {
            patientProfile: true,
            researcher: true,
        },
    });
    if (!user) {
        throw new apiError_1.ApiError(401, 'Invalid email or password');
    }
    const isPasswordValid = await bcryptjs_1.default.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
        throw new apiError_1.ApiError(401, 'Invalid email or password');
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user.id);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(new apiResponse_1.ApiResponse(200, {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    }, 'Login successful'));
});
exports.getUserById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = user_1.userIdSchema.parse({ id });
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: validatedId.id },
        include: {
            patientProfile: true,
            researcher: true,
        },
    });
    if (!user) {
        throw new apiError_1.ApiError(404, 'User not found');
    }
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(new apiResponse_1.ApiResponse(200, userWithoutPassword, 'User retrieved successfully'));
});
exports.logoutUser = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Logout successful'));
});
//# sourceMappingURL=userController.js.map