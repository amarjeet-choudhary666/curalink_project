export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'RESEARCHER';
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  patientProfile?: PatientProfile;
  researcher?: ResearcherProfile;
}

export interface PatientProfile {
  id: string;
  userId: string;
  conditions: string[];
  about?: string;
  preferRemote: boolean;
  preferences?: any;
}

export interface ResearcherProfile {
  id: string;
  userId: string;
  specialties: string[];
  interests: string[];
  orcid?: string;
  researchgate?: string;
  availability: boolean;
  meta?: any;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ClinicalTrial {
  id: string;
  externalId?: string;
  title: string;
  summary?: string;
  eligibility?: string;
  phase: 'PHASE_0' | 'PHASE_1' | 'PHASE_2' | 'PHASE_3' | 'PHASE_4' | 'N_A';
  status: 'RECRUITING' | 'ACTIVE_NOT_RECRUITING' | 'COMPLETED' | 'TERMINATED' | 'UNKNOWN';
  locations: string[];
  contactEmail?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  owner?: ResearcherProfile;
  externalUrl?: string;
  tags: string[];
}

export interface Publication {
  id: string;
  title: string;
  abstract?: string;
  authors: string[];
  journal?: string;
  year?: number;
  doi?: string;
  url?: string;
  type: 'JOURNAL' | 'PREPRINT' | 'CONFERENCE' | 'OTHER';
  createdAt: string;
  researcherId?: string;
  researcher?: ResearcherProfile;
}

export interface MeetingRequest {
  id: string;
  senderId: string;
  recipientId: string;
  message?: string;
  scheduledFor?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  sender: User;
  recipient: User;
}