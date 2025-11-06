import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { prisma } from '../lib/prisma';
import { createUserSchema, updateUserSchema, userIdSchema, loginSchema, CreateUserInput, UpdateUserInput, UserIdInput, LoginInput } from '../validation/user';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: CreateUserInput = createUserSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  const user = await prisma.user.create({
    data: {
      ...validatedData,
      password: hashedPassword,
    },
  });

  const { password, ...userWithoutPassword } = user;

  res.status(201).json(new ApiResponse(201, userWithoutPassword, 'User created successfully'));
});


























export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: UserIdInput = userIdSchema.parse({ id });
  const validatedData: UpdateUserInput = updateUserSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: validatedId.id },
    data: validatedData,
  });

  res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedData: LoginInput = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: validatedData.email },
    include: {
      patientProfile: true,
      researcher: true,
    },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const { password, ...userWithoutPassword } = user;

  res.status(200).json(new ApiResponse(200, {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  }, 'Login successful'));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedId: UserIdInput = userIdSchema.parse({ id });

  const user = await prisma.user.findUnique({
    where: { id: validatedId.id },
    include: {
      patientProfile: true,
      researcher: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { password, ...userWithoutPassword } = user;

  res.status(200).json(new ApiResponse(200, userWithoutPassword, 'User retrieved successfully'));
});

export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, null, 'Logout successful'));
});