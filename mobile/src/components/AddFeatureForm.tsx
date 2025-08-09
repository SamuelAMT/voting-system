import React, { useState } from 'react';
import { Feature } from '../types/Feature';
import { apiService } from '../services/api';
import './AddFeatureForm.css';

interface AddFeatureFormProps {
  onFeatureAdded: (feature: Feature) => void;
  onCancel: () => void;
}

export const AddFeatureForm: React.FC<AddFeatureFormProps> = ({
  onFeatureAdded,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    authorName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.authorName.trim()) {
      setError('Title and author name are required');
      return;
    }

    if (formData.title.length > 255) {
      setError('Title must be less than 255 characters');
      return;
    }

    if (formData.authorName.length > 100) {
      setError('Author name must be less than 100 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.createFeature({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        authorName: formData.authorName.trim(),
      });

      onFeatureAdded(response.data);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        authorName: ''
      });
    } catch (err: any) {
      console.error('Error creating feature:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create feature';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-feature-form">
      <div className="form-header">
        <h3>Suggest a New Feature</h3>
        <button 
          className="close-btn" 
          onClick={onCancel}
          type="button"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="feature-form">
        <div className="form-group">
          <label htmlFor="title">
            Feature Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="What feature would you like to see?"
            maxLength={255}
            required
          />
          <div className="char-count">
            {formData.title.length}/255
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide more details about this feature..."
            rows={3}
            maxLength={1000}
          />
          <div className="char-count">
            {formData.description.length}/1000
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="authorName">
            Your Name *
          </label>
          <input
            type="text"
            id="authorName"
            name="authorName"
            value={formData.authorName}
            onChange={handleInputChange}
            placeholder="Who's suggesting this feature?"
            maxLength={100}
            required
          />
          <div className="char-count">
            {formData.authorName.length}/100
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formData.title.trim() || !formData.authorName.trim()}
          >
            {loading ? 'Creating...' : 'Suggest Feature'}
          </button>
        </div>
      </form>
    </div>
  );
};