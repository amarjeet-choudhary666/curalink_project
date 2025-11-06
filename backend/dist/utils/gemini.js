"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePublicationSummary = exports.generateTrialSummary = exports.extractMedicalConditions = exports.generateSummary = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../validation/env");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const env = env_1.envSchema.parse(process.env);
const apiKey = env.GEMINI_API_KEY;
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
const generateSummary = async (text, maxLength = 200) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Please provide a concise summary of the following text in ${maxLength} characters or less. Focus on key points and make it easy to understand:\n\n${text}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();
        return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
    }
    catch (error) {
        console.error('Error generating summary with Gemini:', error);
        return 'Summary unavailable at this time.';
    }
};
exports.generateSummary = generateSummary;
const extractMedicalConditions = async (input) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Extract medical conditions or diseases from the following text. Return them as a comma-separated list. If none are found, return an empty string:\n\n${input}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const conditions = response.text().trim();
        return conditions ? conditions.split(',').map(c => c.trim()).filter(c => c.length > 0) : [];
    }
    catch (error) {
        console.error('Error extracting medical conditions with Gemini:', error);
        return [];
    }
};
exports.extractMedicalConditions = extractMedicalConditions;
const generateTrialSummary = async (trialData) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Summarize this clinical trial in 150 characters or less, highlighting key eligibility criteria and phase:\n\nTitle: ${trialData.title}\nSummary: ${trialData.summary || 'N/A'}\nEligibility: ${trialData.eligibility || 'N/A'}\nPhase: ${trialData.phase || 'N/A'}\nStatus: ${trialData.status || 'N/A'}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();
        return summary.length > 150 ? summary.substring(0, 150) + '...' : summary;
    }
    catch (error) {
        console.error('Error generating trial summary with Gemini:', error);
        return 'Trial summary unavailable.';
    }
};
exports.generateTrialSummary = generateTrialSummary;
const generatePublicationSummary = async (publicationData) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Summarize this publication in 200 characters or less, focusing on the main findings:\n\nTitle: ${publicationData.title}\nAbstract: ${publicationData.abstract || 'N/A'}\nAuthors: ${publicationData.authors?.join(', ') || 'N/A'}\nJournal: ${publicationData.journal || 'N/A'}\nYear: ${publicationData.year || 'N/A'}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();
        return summary.length > 200 ? summary.substring(0, 200) + '...' : summary;
    }
    catch (error) {
        console.error('Error generating publication summary with Gemini:', error);
        return 'Publication summary unavailable.';
    }
};
exports.generatePublicationSummary = generatePublicationSummary;
//# sourceMappingURL=gemini.js.map