"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postIdSchema = exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    communityId: zod_1.z.string().uuid().optional(),
    title: zod_1.z.string().min(1, 'Title is required'),
    body: zod_1.z.string().min(1, 'Body is required'),
});
exports.updatePostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    body: zod_1.z.string().min(1, 'Body is required').optional(),
    locked: zod_1.z.boolean().optional(),
});
exports.postIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid post ID'),
});
//# sourceMappingURL=post.js.map