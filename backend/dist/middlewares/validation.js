"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validateParams = exports.validateRequest = void 0;
const zod_1 = require("zod");
const apiError_1 = require("../utils/apiError");
const validateRequest = (schema) => {
    return (req, _res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
                next(new apiError_1.ApiError(400, `Validation error: ${errorMessages.join(', ')}`));
            }
            else {
                next(new apiError_1.ApiError(400, 'Invalid request data'));
            }
        }
    };
};
exports.validateRequest = validateRequest;
const validateParams = (schema) => {
    return (req, _res, next) => {
        try {
            const validatedParams = schema.parse(req.params);
            req.validatedParams = validatedParams;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
                next(new apiError_1.ApiError(400, `Parameter validation error: ${errorMessages.join(', ')}`));
            }
            else {
                next(new apiError_1.ApiError(400, 'Invalid parameters'));
            }
        }
    };
};
exports.validateParams = validateParams;
const validateQuery = (schema) => {
    return (req, _res, next) => {
        try {
            const validatedQuery = schema.parse(req.query);
            req.validatedQuery = validatedQuery;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
                next(new apiError_1.ApiError(400, `Query validation error: ${errorMessages.join(', ')}`));
            }
            else {
                next(new apiError_1.ApiError(400, 'Invalid query parameters'));
            }
        }
    };
};
exports.validateQuery = validateQuery;
//# sourceMappingURL=validation.js.map