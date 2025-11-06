"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFavorites = exports.removeFavoriteResearcher = exports.addFavoriteResearcher = exports.removeFavoritePublication = exports.addFavoritePublication = exports.removeFavoriteTrial = exports.addFavoriteTrial = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const favorites_1 = require("../validation/favorites");
exports.addFavoriteTrial = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = favorites_1.favoriteTrialSchema.parse(req.body);
    const existingFavorite = await prisma_1.prisma.favoriteTrial.findUnique({
        where: {
            userId_trialId: {
                userId: validatedData.userId,
                trialId: validatedData.trialId,
            },
        },
    });
    if (existingFavorite) {
        throw new apiError_1.ApiError(400, 'Trial already in favorites');
    }
    const favorite = await prisma_1.prisma.favoriteTrial.create({
        data: validatedData,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, favorite, 'Trial added to favorites'));
});
exports.removeFavoriteTrial = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, trialId } = req.params;
    const favorite = await prisma_1.prisma.favoriteTrial.findUnique({
        where: {
            userId_trialId: {
                userId,
                trialId,
            },
        },
    });
    if (!favorite) {
        throw new apiError_1.ApiError(404, 'Favorite not found');
    }
    await prisma_1.prisma.favoriteTrial.delete({
        where: {
            userId_trialId: {
                userId,
                trialId,
            },
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Trial removed from favorites'));
});
exports.addFavoritePublication = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = favorites_1.favoritePublicationSchema.parse(req.body);
    const existingFavorite = await prisma_1.prisma.favoritePublication.findUnique({
        where: {
            userId_publicationId: {
                userId: validatedData.userId,
                publicationId: validatedData.publicationId,
            },
        },
    });
    if (existingFavorite) {
        throw new apiError_1.ApiError(400, 'Publication already in favorites');
    }
    const favorite = await prisma_1.prisma.favoritePublication.create({
        data: validatedData,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, favorite, 'Publication added to favorites'));
});
exports.removeFavoritePublication = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, publicationId } = req.params;
    const favorite = await prisma_1.prisma.favoritePublication.findUnique({
        where: {
            userId_publicationId: {
                userId,
                publicationId,
            },
        },
    });
    if (!favorite) {
        throw new apiError_1.ApiError(404, 'Favorite not found');
    }
    await prisma_1.prisma.favoritePublication.delete({
        where: {
            userId_publicationId: {
                userId,
                publicationId,
            },
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Publication removed from favorites'));
});
exports.addFavoriteResearcher = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = favorites_1.favoriteResearcherSchema.parse(req.body);
    const existingFavorite = await prisma_1.prisma.favoriteResearcher.findUnique({
        where: {
            userId_researcherId: {
                userId: validatedData.userId,
                researcherId: validatedData.researcherId,
            },
        },
    });
    if (existingFavorite) {
        throw new apiError_1.ApiError(400, 'Researcher already in favorites');
    }
    const favorite = await prisma_1.prisma.favoriteResearcher.create({
        data: validatedData,
    });
    res.status(201).json(new apiResponse_1.ApiResponse(201, favorite, 'Researcher added to favorites'));
});
exports.removeFavoriteResearcher = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, researcherId } = req.params;
    const favorite = await prisma_1.prisma.favoriteResearcher.findUnique({
        where: {
            userId_researcherId: {
                userId,
                researcherId,
            },
        },
    });
    if (!favorite) {
        throw new apiError_1.ApiError(404, 'Favorite not found');
    }
    await prisma_1.prisma.favoriteResearcher.delete({
        where: {
            userId_researcherId: {
                userId,
                researcherId,
            },
        },
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, 'Researcher removed from favorites'));
});
exports.getUserFavorites = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.params;
    const [favoriteTrials, favoritePublications, favoriteResearchers] = await Promise.all([
        prisma_1.prisma.favoriteTrial.findMany({
            where: { userId },
            include: {
                trial: {
                    include: {
                        owner: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma_1.prisma.favoritePublication.findMany({
            where: { userId },
            include: {
                publication: {
                    include: {
                        researcher: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma_1.prisma.favoriteResearcher.findMany({
            where: { userId },
            include: {
                researcher: {
                    include: {
                        user: true,
                    },
                },
            },
        }),
    ]);
    res.status(200).json(new apiResponse_1.ApiResponse(200, {
        trials: favoriteTrials,
        publications: favoritePublications,
        researchers: favoriteResearchers,
    }, 'User favorites retrieved successfully'));
});
//# sourceMappingURL=favoritesController.js.map