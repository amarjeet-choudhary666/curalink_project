"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesRoutes = void 0;
const express_1 = require("express");
const favoritesController_1 = require("../controllers/favoritesController");
const validation_1 = require("../middlewares/validation");
const favorites_1 = require("../validation/favorites");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.favoritesRoutes = router;
// Favorites routes
router.post('/trials', auth_1.authenticateToken, (0, validation_1.validateRequest)(favorites_1.favoriteTrialSchema), favoritesController_1.addFavoriteTrial);
router.delete('/trials/:userId/:trialId', auth_1.authenticateToken, favoritesController_1.removeFavoriteTrial);
router.post('/publications', auth_1.authenticateToken, (0, validation_1.validateRequest)(favorites_1.favoritePublicationSchema), favoritesController_1.addFavoritePublication);
router.delete('/publications/:userId/:publicationId', auth_1.authenticateToken, favoritesController_1.removeFavoritePublication);
router.post('/researchers', auth_1.authenticateToken, (0, validation_1.validateRequest)(favorites_1.favoriteResearcherSchema), favoritesController_1.addFavoriteResearcher);
router.delete('/researchers/:userId/:researcherId', auth_1.authenticateToken, favoritesController_1.removeFavoriteResearcher);
router.get('/user/:userId', auth_1.authenticateToken, favoritesController_1.getUserFavorites);
//# sourceMappingURL=favoritesRoutes.js.map