"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireRole = exports.authenticateToken = void 0;
const apiError_1 = require("../utils/apiError");
const jwt_1 = require("../utils/jwt");
const prisma_1 = require("../lib/prisma");
const authenticateToken = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            throw new apiError_1.ApiError(401, 'Access token required');
        }
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                patientProfile: true,
                researcher: true,
            },
        });
        if (!user) {
            throw new apiError_1.ApiError(401, 'User not found');
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new apiError_1.ApiError(401, 'Invalid or expired token'));
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new apiError_1.ApiError(401, 'Authentication required'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new apiError_1.ApiError(403, 'Insufficient permissions'));
        }
        next();
    };
};
exports.requireRole = requireRole;
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decoded = (0, jwt_1.verifyAccessToken)(token);
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                include: {
                    patientProfile: true,
                    researcher: true,
                },
            });
            req.user = user;
        }
        next();
    }
    catch (error) {
        // Ignore auth errors for optional auth
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map