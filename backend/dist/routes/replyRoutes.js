"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyRoutes = void 0;
const express_1 = require("express");
const replyController_1 = require("../controllers/replyController");
const validation_1 = require("../middlewares/validation");
const reply_1 = require("../validation/reply");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.replyRoutes = router;
// Reply routes
router.post('/', auth_1.authenticateToken, (0, validation_1.validateRequest)(reply_1.createReplySchema), replyController_1.createReply);
router.put('/:id', auth_1.authenticateToken, (0, validation_1.validateParams)(reply_1.replyIdSchema), (0, validation_1.validateRequest)(reply_1.updateReplySchema), replyController_1.updateReply);
router.get('/post/:postId', auth_1.optionalAuth, replyController_1.listRepliesByPost);
router.get('/:id', auth_1.optionalAuth, (0, validation_1.validateParams)(reply_1.replyIdSchema), replyController_1.getReplyById);
//# sourceMappingURL=replyRoutes.js.map