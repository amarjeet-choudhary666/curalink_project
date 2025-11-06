"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityIdSchema = exports.updateCommunitySchema = exports.createCommunitySchema = void 0;
const zod_1 = require("zod");
exports.createCommunitySchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    createdBy: zod_1.z.string().uuid().optional(),
});
exports.updateCommunitySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    description: zod_1.z.string().optional(),
});
exports.communityIdSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, 'Community slug is required'),
});
//# sourceMappingURL=community.js.map