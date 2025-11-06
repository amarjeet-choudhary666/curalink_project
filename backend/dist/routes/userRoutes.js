"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middlewares/validation");
const user_1 = require("../validation/user");
const router = (0, express_1.Router)();
exports.userRoutes = router;
// User routes
router.post('/', (0, validation_1.validateRequest)(user_1.createUserSchema), userController_1.createUser);
router.post('/login', (0, validation_1.validateRequest)(user_1.loginSchema), userController_1.loginUser);
router.post('/logout', userController_1.logoutUser);
router.put('/:id', (0, validation_1.validateParams)(user_1.userIdSchema), (0, validation_1.validateRequest)(user_1.updateUserSchema), userController_1.updateUser);
router.get('/:id', (0, validation_1.validateParams)(user_1.userIdSchema), userController_1.getUserById);
//# sourceMappingURL=userRoutes.js.map