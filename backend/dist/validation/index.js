"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Environment validation
__exportStar(require("./env"), exports);
// API key validations
__exportStar(require("./gemini"), exports);
// User and profile validations
__exportStar(require("./user"), exports);
__exportStar(require("./patientProfile"), exports);
__exportStar(require("./researcherProfile"), exports);
// Core entity validations
__exportStar(require("./clinicalTrial"), exports);
__exportStar(require("./publication"), exports);
// Relationship validations
__exportStar(require("./favorites"), exports);
__exportStar(require("./meetingRequest"), exports);
__exportStar(require("./connection"), exports);
// Community and discussion validations
__exportStar(require("./community"), exports);
__exportStar(require("./post"), exports);
__exportStar(require("./reply"), exports);
//# sourceMappingURL=index.js.map