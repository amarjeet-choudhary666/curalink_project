"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Import routes
const userRoutes_1 = require("./routes/userRoutes");
const patientProfileRoutes_1 = require("./routes/patientProfileRoutes");
const researcherProfileRoutes_1 = require("./routes/researcherProfileRoutes");
const clinicalTrialRoutes_1 = require("./routes/clinicalTrialRoutes");
const publicationRoutes_1 = require("./routes/publicationRoutes");
const favoritesRoutes_1 = require("./routes/favoritesRoutes");
const meetingRequestRoutes_1 = require("./routes/meetingRequestRoutes");
const communityRoutes_1 = require("./routes/communityRoutes");
const postRoutes_1 = require("./routes/postRoutes");
const replyRoutes_1 = require("./routes/replyRoutes");
const connectionRoutes_1 = require("./routes/connectionRoutes");
// Import middlewares
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ limit: "16kb", extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true
}));
// API routes
app.use('/api/users', userRoutes_1.userRoutes);
app.use('/api/patient-profiles', patientProfileRoutes_1.patientProfileRoutes);
app.use('/api/researcher-profiles', researcherProfileRoutes_1.researcherProfileRoutes);
app.use('/api/clinical-trials', clinicalTrialRoutes_1.clinicalTrialRoutes);
app.use('/api/publications', publicationRoutes_1.publicationRoutes);
app.use('/api/favorites', favoritesRoutes_1.favoritesRoutes);
app.use('/api/meeting-requests', meetingRequestRoutes_1.meetingRequestRoutes);
app.use('/api/communities', communityRoutes_1.communityRoutes);
app.use('/api/posts', postRoutes_1.postRoutes);
app.use('/api/replies', replyRoutes_1.replyRoutes);
app.use('/api/connections', connectionRoutes_1.connectionRoutes);
// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', message: 'CuraLink API is running' });
});
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
//# sourceMappingURL=app.js.map