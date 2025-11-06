"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionIdSchema = exports.updateConnectionSchema = exports.createConnectionSchema = void 0;
const zod_1 = require("zod");
exports.createConnectionSchema = zod_1.z.object({
    targetId: zod_1.z.string().uuid('Invalid target user ID'),
});
exports.updateConnectionSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'CONNECTED', 'REJECTED']).optional(),
});
exports.connectionIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid connection ID'),
});
//# sourceMappingURL=connection.js.map