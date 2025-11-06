"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionRoutes = void 0;
const express_1 = require("express");
const connectionController_1 = require("../controllers/connectionController");
const validation_1 = require("../middlewares/validation");
const connection_1 = require("../validation/connection");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.connectionRoutes = router;
// Connection routes
router.post('/', auth_1.authenticateToken, (0, validation_1.validateRequest)(connection_1.createConnectionSchema), connectionController_1.createConnectionRequest);
router.put('/:id', auth_1.authenticateToken, (0, validation_1.validateParams)(connection_1.connectionIdSchema), (0, validation_1.validateRequest)(connection_1.updateConnectionSchema), connectionController_1.updateConnectionStatus);
router.get('/:id', auth_1.authenticateToken, (0, validation_1.validateParams)(connection_1.connectionIdSchema), connectionController_1.getConnectionById);
router.get('/user/:userId', auth_1.authenticateToken, connectionController_1.listUserConnections);
router.put('/:id/accept', auth_1.authenticateToken, (0, validation_1.validateParams)(connection_1.connectionIdSchema), connectionController_1.acceptConnection);
router.put('/:id/reject', auth_1.authenticateToken, (0, validation_1.validateParams)(connection_1.connectionIdSchema), connectionController_1.rejectConnection);
//# sourceMappingURL=connectionRoutes.js.map