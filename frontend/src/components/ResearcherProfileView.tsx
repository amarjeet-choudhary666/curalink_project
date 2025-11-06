import React from 'react';

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

interface ResearcherProfileViewProps {
  profile: ResearcherProfile;
  onEdit: () => void;
}

const ResearcherProfileView: React.FC<ResearcherProfileViewProps> = ({ profile, onEdit }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Researcher Profile</h2>
        <button
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Specialties</h3>
          {profile.specialties.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {profile.specialties.map((specialty, index) => (
                <li key={index}>{specialty}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No specialties specified</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Research Interests</h3>
          {profile.interests.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {profile.interests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No research interests specified</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Professional IDs</h3>
          <div className="space-y-2">
            {profile.orcid && (
              <div>
                <span className="text-gray-600">ORCID:</span>
                <a
                  href={`https://orcid.org/${profile.orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  {profile.orcid}
                </a>
              </div>
            )}
            {profile.researchgate && (
              <div>
                <span className="text-gray-600">ResearchGate:</span>
                <a
                  href={`https://www.researchgate.net/profile/${profile.researchgate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  {profile.researchgate}
                </a>
              </div>
            )}
            {!profile.orcid && !profile.researchgate && (
              <p className="text-gray-600">No professional IDs provided</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Availability</h3>
          <span className={`px-2 py-1 rounded text-sm ${profile.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {profile.availability ? 'Available for collaboration' : 'Not available'}
          </span>
        </div>
      </div>

      {((profile.publications?.length ?? 0) > 0 || (profile.trials?.length ?? 0) > 0) && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Research Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.publications && profile.publications.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Publications</h4>
                <p className="text-gray-600">{profile.publications.length} publication(s)</p>
              </div>
            )}
            {profile.trials && profile.trials.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Clinical Trials</h4>
                <p className="text-gray-600">{profile.trials.length} trial(s)</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearcherProfileView;