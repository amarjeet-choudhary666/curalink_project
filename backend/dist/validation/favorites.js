"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteResearcherSchema = exports.favoritePublicationSchema = exports.favoriteTrialSchema = void 0;
const zod_1 = require("zod");
exports.favoriteTrialSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    trialId: zod_1.z.string().uuid('Invalid trial ID'),
});
exports.favoritePublicationSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    publicationId: zod_1.z.string().uuid('Invalid publication ID'),
});
exports.favoriteResearcherSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid('Invalid user ID'),
    researcherId: zod_1.z.string().uuid('Invalid researcher ID'),
});
//# sourceMappingURL=favorites.js.map