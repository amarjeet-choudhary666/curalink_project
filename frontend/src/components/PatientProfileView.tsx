import React from 'react';

interface PatientProfile {
  userId: string;
  conditions: string[];
  about?: string;
  preferRemote: boolean;
  preferences?: any;
}

interface PatientProfileViewProps {
  profile: PatientProfile;
  onEdit: () => void;
}

const PatientProfileView: React.FC<PatientProfileViewProps> = ({ profile, onEdit }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Patient Profile</h2>
        <button
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">About</h3>
          <p className="text-gray-600">{profile.about || 'No information provided'}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Conditions</h3>
          {profile.conditions.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {profile.conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No conditions specified</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Prefer Remote Consultations:</span>
              <span className={`px-2 py-1 rounded text-sm ${profile.preferRemote ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {profile.preferRemote ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileView;