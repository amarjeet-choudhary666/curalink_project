"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicationRoutes = void 0;
const express_1 = require("express");
const publicationController_1 = require("../controllers/publicationController");
const validation_1 = require("../middlewares/validation");
const publication_1 = require("../validation/publication");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.publicationRoutes = router;
// Publication routes
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['RESEARCHER']), (0, validation_1.validateRequest)(publication_1.createPublicationSchema), publicationController_1.createPublication);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['RESEARCHER']), (0, validation_1.validateParams)(publication_1.publicationIdSchema), (0, validation_1.validateRequest)(publication_1.updatePublicationSchema), publicationController_1.updatePublication);
router.get('/search', auth_1.optionalAuth, publicationController_1.searchPublications);
router.get('/', auth_1.optionalAuth, publicationController_1.listPublications);
router.get('/:id', auth_1.optionalAuth, (0, validation_1.validateParams)(publication_1.publicationIdSchema), publicationController_1.getPublicationById);
//# sourceMappingURL=publicationRoutes.js.map