"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicationIdSchema = exports.updatePublicationSchema = exports.createPublicationSchema = void 0;
const zod_1 = require("zod");
exports.createPublicationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    abstract: zod_1.z.string().optional(),
    authors: zod_1.z.array(zod_1.z.string()).default([]),
    journal: zod_1.z.string().optional(),
    year: zod_1.z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    doi: zod_1.z.string().optional(),
    url: zod_1.z.string().url().optional(),
    type: zod_1.z.enum(['JOURNAL', 'PREPRINT', 'CONFERENCE', 'OTHER']).default('JOURNAL'),
    researcherId: zod_1.z.string().uuid().optional(),
});
exports.updatePublicationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    abstract: zod_1.z.string().optional(),
    authors: zod_1.z.array(zod_1.z.string()).optional(),
    journal: zod_1.z.string().optional(),
    year: zod_1.z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
    doi: zod_1.z.string().optional(),
    url: zod_1.z.string().url().optional(),
    type: zod_1.z.enum(['JOURNAL', 'PREPRINT', 'CONFERENCE', 'OTHER']).optional(),
});
exports.publicationIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid publication ID'),
});
//# sourceMappingURL=publication.js.map