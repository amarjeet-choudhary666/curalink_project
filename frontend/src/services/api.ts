const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

import type { ApiResponse, LoginResponse, User, ClinicalTrial, Publication, MeetingRequest } from '../types/api';

interface FavoritesResponse {
  publications: never[];
  researchers: never[];
  trials: never[];
  favoriteTrials?: Array<{ id: string; trialId: string; createdAt: string; trial?: any }>;
  favoritePublications?: Array<{ id: string; publicationId: string; createdAt: string; publication?: any }>;
  favoriteResearchers?: Array<{ id: string; researcherId: string; createdAt: string; researcher?: any }>;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('accessToken');
    console.log('API Request - Token exists:', !!token);
    console.log('API Request - URL:', url);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
      console.log('API Request - Authorization header added');
    } else {
      console.log('API Request - No token found in localStorage');
    }

    try {
      console.log('Making API request with config:', { url, headers: config.headers });
      const response = await fetch(url, config);
      console.log('API Response status:', response.status);
      
      const data = await response.json();
      console.log('API Response data:', data);

      if (!response.ok) {
        console.error('API Error:', response.status, data);
        
        // For favorites operations, don't throw errors for "already exists" cases
        const isFavoritesRequest = endpoint.includes('/favorites/');
        if (response.status === 400 && isFavoritesRequest && data.message) {
          const message = data.message.toLowerCase();
          console.log('Favorites request error:', message);
          
          // For any 400 error on favorites endpoints, return gracefully
          if (message.includes('already') || message.includes('duplicate') || message.includes('exists')) {
            console.log('Returning graceful error for favorites conflict');
            return {
              success: false,
              message: data.message,
              data: null,
            };
          }
        }
        
        console.log('Throwing error for non-favorites issue');
        throw new Error(data.message || `API request failed with status ${response.status}`);
      }

      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role: 'PATIENT' | 'RESEARCHER';
  }) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    const result = await this.request('/users/logout', {
      method: 'POST',
    });
    
    // Clear local storage regardless of API response
    localStorage.removeItem('accessToken');
    
    return result;
  }

  // User endpoints
  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id: string, userData: Partial<{
    name: string;
    bio: string;
    location: string;
  }>) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Patient Profile endpoints
  async getPatientProfile(userId: string) {
    return this.request(`/patient-profiles/${userId}`);
  }

  async createPatientProfile(profileData: {
    userId: string;
    conditions: string[];
    about?: string;
    preferRemote?: boolean;
    preferences?: any;
  }) {
    return this.request('/patient-profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updatePatientProfile(userId: string, profileData: Partial<{
    conditions: string[];
    about: string;
    preferRemote: boolean;
    preferences: any;
  }>) {
    return this.request(`/patient-profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Researcher Profile endpoints
  async listResearchers(params: {
    specialty?: string;
    location?: string;
    availability?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/researcher-profiles?${queryString}`);
  }

  async getResearcherProfile(userId: string) {
    return this.request(`/researcher-profiles/${userId}`);
  }

  async createResearcherProfile(profileData: {
    userId: string;
    specialties: string[];
    interests: string[];
    orcid?: string;
    researchgate?: string;
    availability?: boolean;
    meta?: any;
  }) {
    return this.request('/researcher-profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async updateResearcherProfile(userId: string, profileData: Partial<{
    specialties: string[];
    interests: string[];
    orcid: string;
    researchgate: string;
    availability: boolean;
    meta: any;
  }>) {
    return this.request(`/researcher-profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Clinical Trials endpoints
  async searchClinicalTrials(params: {
    q?: string;
    phase?: string;
    status?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/clinical-trials/search?${queryString}`);
  }

  async listClinicalTrials(params: { limit?: number; offset?: number } = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/clinical-trials?${queryString}`);
  }

  async getClinicalTrialById(id: string) {
    return this.request(`/clinical-trials/${id}`);
  }

  async createClinicalTrial(trialData: {
    title: string;
    summary?: string;
    eligibility?: string;
    phase: string;
    status: string;
    locations: string[];
    contactEmail?: string;
    startDate?: string;
    endDate?: string;
    externalUrl?: string;
    tags: string[];
  }) {
    return this.request('/clinical-trials', {
      method: 'POST',
      body: JSON.stringify(trialData),
    });
  }

  // Favorites endpoints
  async addFavoriteTrial(userId: string, trialId: string) {
    return this.request('/favorites/trials', {
      method: 'POST',
      body: JSON.stringify({ userId, trialId }),
    });
  }

  async removeFavoriteTrial(userId: string, trialId: string) {
    return this.request(`/favorites/trials/${userId}/${trialId}`, {
      method: 'DELETE',
    });
  }

  async getUserFavorites(userId: string): Promise<ApiResponse<FavoritesResponse>> {
    return this.request(`/favorites/user/${userId}`);
  }

  // Publications endpoints
  async searchPublications(params: {
    q?: string;
    journal?: string;
    type?: string;
    year?: number;
    limit?: number;
    offset?: number;
  }) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/publications/search?${queryString}`);
  }

  async listPublications(params: { limit?: number; offset?: number } = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/publications?${queryString}`);
  }

  async getPublicationById(id: string) {
    return this.request(`/publications/${id}`);
  }

  async createPublication(publicationData: {
    title: string;
    abstract: string;
    authors: string[];
    journal?: string;
    year: number;
    type: string;
    doi?: string;
    url?: string;
  }) {
    return this.request('/publications', {
      method: 'POST',
      body: JSON.stringify(publicationData),
    });
  }

  // Favorites for publications
  async addFavoritePublication(userId: string, publicationId: string) {
    return this.request('/favorites/publications', {
      method: 'POST',
      body: JSON.stringify({ userId, publicationId }),
    });
  }

  async removeFavoritePublication(userId: string, publicationId: string) {
    return this.request(`/favorites/publications/${userId}/${publicationId}`, {
      method: 'DELETE',
    });
  }

  // Favorites for researchers
  async addFavoriteResearcher(userId: string, researcherId: string) {
    return this.request('/favorites/researchers', {
      method: 'POST',
      body: JSON.stringify({ userId, researcherId }),
    });
  }

  async removeFavoriteResearcher(userId: string, researcherId: string) {
    return this.request(`/favorites/researchers/${userId}/${researcherId}`, {
      method: 'DELETE',
    });
  }

  // Community endpoints
  async listCommunities(params: { limit?: number; offset?: number } = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/communities?${queryString}`);
  }

  async getCommunityBySlug(slug: string) {
    return this.request(`/communities/${slug}`);
  }

  async createCommunity(communityData: {
    slug: string;
    title: string;
    description?: string;
  }) {
    return this.request('/communities', {
      method: 'POST',
      body: JSON.stringify(communityData),
    });
  }

  async updateCommunity(slug: string, communityData: Partial<{
    title: string;
    description: string;
  }>) {
    return this.request(`/communities/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(communityData),
    });
  }

  // Post endpoints
  async listPosts(params: { limit?: number; offset?: number } = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/posts?${queryString}`);
  }

  async listPostsByCommunity(communitySlug: string, params: { limit?: number; offset?: number } = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/posts/community/${communitySlug}?${queryString}`);
  }

  async getPostById(id: string) {
    return this.request(`/posts/${id}`);
  }

  async createPost(postData: {
    communityId?: string;
    title: string;
    body: string;
  }) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: string, postData: Partial<{
    title: string;
    body: string;
    locked: boolean;
  }>) {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  // Reply endpoints
  async listRepliesByPost(postId: string, params: { limit?: number; offset?: number } = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/replies/post/${postId}?${queryString}`);
  }

  async getReplyById(id: string) {
    return this.request(`/replies/${id}`);
  }

  async createReply(replyData: {
    postId: string;
    body: string;
  }) {
    return this.request('/replies', {
      method: 'POST',
      body: JSON.stringify(replyData),
    });
  }

  async updateReply(id: string, replyData: Partial<{
    body: string;
  }>) {
    return this.request(`/replies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(replyData),
    });
  }

  // Meeting Request endpoints
  async createMeetingRequest(requestData: {
    recipientId: string;
    message?: string;
    scheduledFor?: string;
  }) {
    return this.request('/meeting-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async updateMeetingRequest(id: string, requestData: Partial<{
    message?: string;
    scheduledFor?: string;
    status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  }>) {
    return this.request(`/meeting-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  }

  async getMeetingRequestById(id: string) {
    return this.request(`/meeting-requests/${id}`);
  }

  async listUserMeetingRequests(userId: string, params: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    const url = `/meeting-requests/user/${userId}${queryString ? `?${queryString}` : ''}`;
    console.log('Making request to:', url);
    return this.request(url);
  }

  async acceptMeetingRequest(id: string) {
    return this.request(`/meeting-requests/${id}/accept`, {
      method: 'PUT',
    });
  }

  async rejectMeetingRequest(id: string) {
    return this.request(`/meeting-requests/${id}/reject`, {
      method: 'PUT',
    });
  }

  // Connection endpoints
  async createConnectionRequest(targetId: string) {
    return this.request('/connections', {
      method: 'POST',
      body: JSON.stringify({ targetId }),
    });
  }

  async listUserConnections(userId: string, params: {
    status?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.request(`/connections/user/${userId}?${queryString}`);
  }

  async acceptConnection(id: string) {
    return this.request(`/connections/${id}/accept`, {
      method: 'PUT',
    });
  }

  async rejectConnection(id: string) {
    return this.request(`/connections/${id}/reject`, {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();
export default apiService;