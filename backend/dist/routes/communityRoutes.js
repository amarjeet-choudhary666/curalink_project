"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityRoutes = void 0;
const express_1 = require("express");
const communityController_1 = require("../controllers/communityController");
const validation_1 = require("../middlewares/validation");
const community_1 = require("../validation/community");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.communityRoutes = router;
// Community routes
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['RESEARCHER', 'ADMIN', 'PATIENT']), (0, validation_1.validateRequest)(community_1.createCommunitySchema), communityController_1.createCommunity);
router.put('/:slug', auth_1.authenticateToken, (0, auth_1.requireRole)(['RESEARCHER', 'ADMIN']), (0, validation_1.validateParams)(community_1.communityIdSchema), (0, validation_1.validateRequest)(community_1.updateCommunitySchema), communityController_1.updateCommunity);
router.get('/', auth_1.optionalAuth, communityController_1.listCommunities);
router.get('/:slug', auth_1.optionalAuth, (0, validation_1.validateParams)(community_1.communityIdSchema), communityController_1.getCommunityBySlug);
//# sourceMappingURL=communityRoutes.js.map