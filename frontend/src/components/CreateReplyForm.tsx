import { useState } from 'react';
import apiService from '../services/api';

interface CreateReplyFormProps {
  postId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateReplyForm = ({ postId, onSuccess, onCancel }: CreateReplyFormProps) => {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!body.trim()) {
      setError('Reply body is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiService.createReply({
        postId,
        body: body.trim(),
      });

      if (response.success) {
        setBody('');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || 'Failed to create reply');
      }
    } catch (err) {
      setError('An error occurred while creating the reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="replyBody" className="block text-sm font-medium text-gray-700 mb-2">
            Your Reply
          </label>
          <textarea
            id="replyBody"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Share your thoughts..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !body.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReplyForm;