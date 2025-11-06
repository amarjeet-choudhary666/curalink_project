"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const validation_1 = require("../middlewares/validation");
const post_1 = require("../validation/post");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.postRoutes = router;
// Post routes
router.post('/', auth_1.authenticateToken, (0, validation_1.validateRequest)(post_1.createPostSchema), postController_1.createPost);
router.put('/:id', auth_1.authenticateToken, (0, validation_1.validateParams)(post_1.postIdSchema), (0, validation_1.validateRequest)(post_1.updatePostSchema), postController_1.updatePost);
router.get('/', auth_1.optionalAuth, postController_1.listAllPosts);
router.get('/community/:communitySlug', auth_1.optionalAuth, postController_1.listPostsByCommunity);
router.get('/:id', auth_1.optionalAuth, (0, validation_1.validateParams)(post_1.postIdSchema), postController_1.getPostById);
//# sourceMappingURL=postRoutes.js.map