"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.userIdSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    phone: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, 'Name is required'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['PATIENT', 'RESEARCHER', 'ADMIN']).default('PATIENT'),
    bio: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').optional(),
    bio: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.userIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid user ID'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
//# sourceMappingURL=user.js.map