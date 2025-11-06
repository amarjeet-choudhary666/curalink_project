"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPublications = exports.searchPublications = exports.getPublicationById = exports.updatePublication = exports.createPublication = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
const prisma_1 = require("../lib/prisma");
const publication_1 = require("../validation/publication");
const gemini_1 = require("../utils/gemini");
exports.createPublication = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = publication_1.createPublicationSchema.parse(req.body);
    const publication = await prisma_1.prisma.publication.create({
        data: validatedData,
    });
    // Generate AI summary if not provided
    if (!publication.abstract && publication.title) {
        const summary = await (0, gemini_1.generateSummary)(`Summarize this publication: ${publication.title}`);
        await prisma_1.prisma.publication.update({
            where: { id: publication.id },
            data: { abstract: summary },
        });
        publication.abstract = summary;
    }
    res.status(201).json(new apiResponse_1.ApiResponse(201, publication, 'Publication created successfully'));
});
exports.updatePublication = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = publication_1.publicationIdSchema.parse({ id });
    const validatedData = publication_1.updatePublicationSchema.parse(req.body);
    const publication = await prisma_1.prisma.publication.update({
        where: { id: validatedId.id },
        data: validatedData,
    });
    res.status(200).json(new apiResponse_1.ApiResponse(200, publication, 'Publication updated successfully'));
});
exports.getPublicationById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const validatedId = publication_1.publicationIdSchema.parse({ id });
    const publication = await prisma_1.prisma.publication.findUnique({
        where: { id: validatedId.id },
        include: {
            researcher: {
                include: {
                    user: true,
                },
            },
            favorites: true,
        },
    });
    if (!publication) {
        throw new apiError_1.ApiError(404, 'Publication not found');
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, publication, 'Publication retrieved successfully'));
});
exports.searchPublications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { q, journal, type, year, limit = 20, offset = 0 } = req.query;
    const where = {};
    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { abstract: { contains: q, mode: 'insensitive' } },
            { authors: { hasSome: [q] } },
        ];
    }
    if (journal) {
        where.journal = { contains: journal, mode: 'insensitive' };
    }
    if (type) {
        where.type = type;
    }
    if (year) {
        where.year = parseInt(year);
    }
    const publications = await prisma_1.prisma.publication.findMany({
        where,
        include: {
            researcher: {
                include: {
                    user: true,
                },
            },
        },
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { year: 'desc' },
    });
    const total = await prisma_1.prisma.publication.count({ where });
    res.status(200).json(new apiResponse_1.ApiResponse(200, { publications, total, limit, offset }, 'Publications retrieved successfully'));
});
exports.listPublications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { limit = 20, offset = 0 } = req.query;
    const publications = await prisma_1.prisma.publication.findMany({
        include: {
            researcher: {
                include: {
                    user: true,
                },
            },
        },
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { year: 'desc' },
    });
    const total = await prisma_1.prisma.publication.count();
    res.status(200).json(new apiResponse_1.ApiResponse(200, { publications, total, limit, offset }, 'Publications listed successfully'));
});
//# sourceMappingURL=publicationController.js.map