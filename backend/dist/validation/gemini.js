"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiApiKeySchema = void 0;
const zod_1 = require("zod");
exports.GeminiApiKeySchema = zod_1.z.string().min(1, 'Gemini API key is required');
//# sourceMappingURL=gemini.js.map