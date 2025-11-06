import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCommunityBySlugQuery } from '../features/community/communityApi';
import { useCreatePostMutation } from '../features/post/postApi';

interface CreatePostFormProps {
  communityId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreatePostForm = ({ communityId, onSuccess, onCancel }: CreatePostFormProps) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });
  const [error, setError] = useState<string | null>(null);

  // RTK Query hooks
  const { data: community } = useGetCommunityBySlugQuery(slug || '', {
    skip: !slug || !!communityId,
  });
  
  const [createPost, { isLoading: loading }] = useCreatePostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.body.trim()) {
      setError('Title and body are required');
      return;
    }

    try {
      setError(null);

      const postData: any = {
        title: formData.title.trim(),
        body: formData.body.trim(),
      };

      // If communityId is provided, use it; otherwise use community from RTK Query
      if (communityId) {
        postData.communityId = communityId;
      } else if (community) {
        postData.communityId = community.id;
        console.log('Found community ID:', community.id);
      } else {
        setError(`Community "${slug}" not found. Please check the community exists.`);
        return;
      }

      const result = await createPost(postData).unwrap();

      if (result) {
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate back to community or posts list
          if (slug) {
            navigate(`/community/${slug}`);
          } else {
            navigate('/community');
          }
        }
      }
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError(err.data?.message || err.message || 'An error occurred while creating the post');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto container-responsive">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-responsive-xl">Create New Post</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title..."
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              Body *
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts, questions, or experiences..."
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
              disabled={loading || !formData.title.trim() || !formData.body.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;