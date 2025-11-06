"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientProfileSchema = exports.createPatientProfileSchema = void 0;
const zod_1 = require("zod");
exports.createPatientProfileSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    conditions: zod_1.z.array(zod_1.z.string()).default([]),
    about: zod_1.z.string().optional(),
    preferRemote: zod_1.z.boolean().default(false),
    preferences: zod_1.z.any().optional(),
});
exports.updatePatientProfileSchema = zod_1.z.object({
    conditions: zod_1.z.array(zod_1.z.string()).optional(),
    about: zod_1.z.string().optional(),
    preferRemote: zod_1.z.boolean().optional(),
    preferences: zod_1.z.any().optional(),
});
//# sourceMappingURL=patientProfile.js.map