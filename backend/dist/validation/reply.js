"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyIdSchema = exports.updateReplySchema = exports.createReplySchema = void 0;
const zod_1 = require("zod");
exports.createReplySchema = zod_1.z.object({
    postId: zod_1.z.string().uuid('Invalid post ID'),
    body: zod_1.z.string().min(1, 'Reply body is required'),
});
exports.updateReplySchema = zod_1.z.object({
    body: zod_1.z.string().min(1, 'Reply body is required').optional(),
});
exports.replyIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid reply ID'),
});
//# sourceMappingURL=reply.js.map