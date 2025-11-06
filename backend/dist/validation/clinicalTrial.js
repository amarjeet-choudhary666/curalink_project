"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trialIdSchema = exports.updateClinicalTrialSchema = exports.createClinicalTrialSchema = void 0;
const zod_1 = require("zod");
exports.createClinicalTrialSchema = zod_1.z.object({
    externalId: zod_1.z.string().optional(),
    title: zod_1.z.string().min(1, 'Title is required'),
    summary: zod_1.z.string().optional(),
    eligibility: zod_1.z.string().optional(),
    phase: zod_1.z.enum(['PHASE_0', 'PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'N_A']).default('N_A'),
    status: zod_1.z.enum(['RECRUITING', 'ACTIVE_NOT_RECRUITING', 'COMPLETED', 'TERMINATED', 'UNKNOWN']).default('UNKNOWN'),
    locations: zod_1.z.array(zod_1.z.string()).default([]),
    contactEmail: zod_1.z.string().email().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    ownerId: zod_1.z.string().uuid().optional(),
    externalUrl: zod_1.z.string().url().optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.updateClinicalTrialSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    summary: zod_1.z.string().optional(),
    eligibility: zod_1.z.string().optional(),
    phase: zod_1.z.enum(['PHASE_0', 'PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'N_A']).optional(),
    status: zod_1.z.enum(['RECRUITING', 'ACTIVE_NOT_RECRUITING', 'COMPLETED', 'TERMINATED', 'UNKNOWN']).optional(),
    locations: zod_1.z.array(zod_1.z.string()).optional(),
    contactEmail: zod_1.z.string().email().optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
    externalUrl: zod_1.z.string().url().optional(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.trialIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid trial ID'),
});
//# sourceMappingURL=clinicalTrial.js.map