"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResearcherProfileSchema = exports.createResearcherProfileSchema = void 0;
const zod_1 = require("zod");
exports.createResearcherProfileSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    specialties: zod_1.z.array(zod_1.z.string()).default([]),
    interests: zod_1.z.array(zod_1.z.string()).default([]),
    orcid: zod_1.z.string().optional(),
    researchgate: zod_1.z.string().optional(),
    availability: zod_1.z.boolean().default(true),
    meta: zod_1.z.any().optional(),
});
exports.updateResearcherProfileSchema = zod_1.z.object({
    specialties: zod_1.z.array(zod_1.z.string()).optional(),
    interests: zod_1.z.array(zod_1.z.string()).optional(),
    orcid: zod_1.z.string().optional(),
    researchgate: zod_1.z.string().optional(),
    availability: zod_1.z.boolean().optional(),
    meta: zod_1.z.any().optional(),
});
//# sourceMappingURL=researcherProfile.js.map