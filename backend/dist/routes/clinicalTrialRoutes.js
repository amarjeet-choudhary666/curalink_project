"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clinicalTrialRoutes = void 0;
const express_1 = require("express");
const clinicalTrialController_1 = require("../controllers/clinicalTrialController");
const validation_1 = require("../middlewares/validation");
const clinicalTrial_1 = require("../validation/clinicalTrial");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.clinicalTrialRoutes = router;
// Clinical trial routes
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)(['RESEARCHER']), (0, validation_1.validateRequest)(clinicalTrial_1.createClinicalTrialSchema), clinicalTrialController_1.createClinicalTrial);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)(['RESEARCHER']), (0, validation_1.validateParams)(clinicalTrial_1.trialIdSchema), (0, validation_1.validateRequest)(clinicalTrial_1.updateClinicalTrialSchema), clinicalTrialController_1.updateClinicalTrial);
router.get('/search', auth_1.optionalAuth, clinicalTrialController_1.searchClinicalTrials);
router.get('/', auth_1.optionalAuth, clinicalTrialController_1.listClinicalTrials);
router.get('/:id', auth_1.optionalAuth, (0, validation_1.validateParams)(clinicalTrial_1.trialIdSchema), clinicalTrialController_1.getClinicalTrialById);
//# sourceMappingURL=clinicalTrialRoutes.js.map