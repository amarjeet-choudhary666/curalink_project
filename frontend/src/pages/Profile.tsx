import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import PatientProfileView from '../components/PatientProfileView';
import PatientProfileEdit from '../components/PatientProfileEdit';
import ResearcherProfileView from '../components/ResearcherProfileView';
import ResearcherProfileEdit from '../components/ResearcherProfileEdit';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';


interface PatientProfile {
  userId: string;
  conditions: string[];
  about?: string;
  preferRemote: boolean;
  preferences?: any;
}

interface ResearcherProfile {
  userId: string;
  specialties: string[];
  interests: string[];
  orcid?: string;
  researchgate?: string;
  availability: boolean;
  meta?: any;
  publications?: any[];
  trials?: any[];
}

const Profile: React.FC = () => {
  const authState = useSelector((state: RootState) => state.auth as any);
  const { user, isAuthenticated } = authState;
  const navigate = useNavigate();
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  const [researcherProfile, setResearcherProfile] = useState<ResearcherProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      if (user.role === 'PATIENT') {
        const response = await apiService.getPatientProfile(user.id);
        if (response.success && response.data) {
          setPatientProfile(response.data as PatientProfile);
        } else {
          // Create default profile if none exists
          setPatientProfile({
            userId: user.id,
            conditions: [],
            about: '',
            preferRemote: false,
          });
        }
      } else if (user.role === 'RESEARCHER') {
        const response = await apiService.getResearcherProfile(user.id);
        if (response.success && response.data) {
          setResearcherProfile(response.data as ResearcherProfile);
        } else {
          // Create default profile if none exists
          setResearcherProfile({
            userId: user.id,
            specialties: [],
            interests: [],
            availability: true,
          });
        }
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePatientProfile = async (updatedProfile: Partial<PatientProfile>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.updatePatientProfile(user.id, updatedProfile);
      if (response.success && response.data) {
        setPatientProfile(response.data as PatientProfile);
        setIsEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResearcherProfile = async (updatedProfile: Partial<ResearcherProfile>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.updateResearcherProfile(user.id, updatedProfile);
      if (response.success && response.data) {
        setResearcherProfile(response.data as ResearcherProfile);
        setIsEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication or loading profile
  if (!isAuthenticated || !user || (loading && !patientProfile && !researcherProfile)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={loadProfile}
            className="ml-4 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {user?.role === 'PATIENT' && patientProfile && (
        <>
          {isEditing ? (
            <PatientProfileEdit
              profile={patientProfile}
              onSave={handleSavePatientProfile}
              onCancel={() => setIsEditing(false)}
              loading={loading}
            />
          ) : (
            <PatientProfileView
              profile={patientProfile}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </>
      )}

      {user?.role === 'RESEARCHER' && researcherProfile && (
        <>
          {isEditing ? (
            <ResearcherProfileEdit
              profile={researcherProfile}
              onSave={handleSaveResearcherProfile}
              onCancel={() => setIsEditing(false)}
              loading={loading}
            />
          ) : (
            <ResearcherProfileView
              profile={researcherProfile}
              onEdit={() => setIsEditing(true)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Profile;