import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

// Import routes
import { userRoutes } from './routes/userRoutes';
import { patientProfileRoutes } from './routes/patientProfileRoutes';
import { researcherProfileRoutes } from './routes/researcherProfileRoutes';
import { clinicalTrialRoutes } from './routes/clinicalTrialRoutes';
import { publicationRoutes } from './routes/publicationRoutes';
import { favoritesRoutes } from './routes/favoritesRoutes';
import { meetingRequestRoutes } from './routes/meetingRequestRoutes';
import { communityRoutes } from './routes/communityRoutes';
import { postRoutes } from './routes/postRoutes';
import { replyRoutes } from './routes/replyRoutes';
import { connectionRoutes } from './routes/connectionRoutes';

// Import middlewares
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb", extended: true}))
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true
}))

// API routes
app.use('/api/users', userRoutes);
app.use('/api/patient-profiles', patientProfileRoutes);
app.use('/api/researcher-profiles', researcherProfileRoutes);
app.use('/api/clinical-trials', clinicalTrialRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/meeting-requests', meetingRequestRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api/connections', connectionRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'CuraLink API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export {app};