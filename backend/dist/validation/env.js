"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    PORT: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()),
    PGHOST: zod_1.z.string().min(1),
    PGDATABASE: zod_1.z.string().min(1),
    PGUSER: zod_1.z.string().min(1),
    PGPASSWORD: zod_1.z.string().min(1),
    ENDPOINT_ID: zod_1.z.string().min(1),
    DATABASE_URL: zod_1.z.string().url(),
    GEMINI_API_KEY: zod_1.z.string().min(1, 'Gemini API key is required'),
});
//# sourceMappingURL=env.js.map