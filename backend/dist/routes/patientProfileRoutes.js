"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientProfileRoutes = void 0;
const express_1 = require("express");
const patientProfileController_1 = require("../controllers/patientProfileController");
const validation_1 = require("../middlewares/validation");
const patientProfile_1 = require("../validation/patientProfile");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.patientProfileRoutes = router;
// Patient profile routes
router.post('/', auth_1.authenticateToken, (0, validation_1.validateRequest)(patientProfile_1.createPatientProfileSchema), patientProfileController_1.createPatientProfile);
router.put('/:userId', auth_1.authenticateToken, (0, validation_1.validateRequest)(patientProfile_1.updatePatientProfileSchema), patientProfileController_1.updatePatientProfile);
router.get('/:userId', auth_1.authenticateToken, patientProfileController_1.getPatientProfile);
//# sourceMappingURL=patientProfileRoutes.js.map