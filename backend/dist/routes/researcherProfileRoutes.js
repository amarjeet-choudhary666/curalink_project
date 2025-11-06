"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.researcherProfileRoutes = void 0;
const express_1 = require("express");
const researcherProfileController_1 = require("../controllers/researcherProfileController");
const validation_1 = require("../middlewares/validation");
const researcherProfile_1 = require("../validation/researcherProfile");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.researcherProfileRoutes = router;
// Researcher profile routes
router.get('/', researcherProfileController_1.listResearchers); // Public endpoint to list researchers
router.post('/', auth_1.authenticateToken, (0, validation_1.validateRequest)(researcherProfile_1.createResearcherProfileSchema), researcherProfileController_1.createResearcherProfile);
router.put('/:userId', auth_1.authenticateToken, (0, validation_1.validateRequest)(researcherProfile_1.updateResearcherProfileSchema), researcherProfileController_1.updateResearcherProfile);
router.get('/:userId', auth_1.authenticateToken, researcherProfileController_1.getResearcherProfile);
router.post('/:userId/import-publications', auth_1.authenticateToken, researcherProfileController_1.importPublications);
//# sourceMappingURL=researcherProfileRoutes.js.map