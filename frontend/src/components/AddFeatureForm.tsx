import React, { useState } from 'react';
import { CreateFeatureRequest } from '../types/Feature';

interface AddFeatureFormProps {
  onSubmit: (feature: CreateFeatureRequest) => Promise<void>;
  loading?: boolean;
}

export const AddFeatureForm: React.FC<AddFeatureFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<CreateFeatureRequest>({
    title: '',
    description: '',
    authorName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateFeatureRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateFeatureRequest> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        authorName: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateFeatureRequest) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
      
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: undefined
        }));
      }
    };

  return (
    <div className="add-feature-form">
      <h2>Submit New Feature Request</h2>
      
      <form onSubmit={handleSubmit} className="feature-form">
        <div className="form-group">
          <label htmlFor="title">Feature Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange('title')}
            placeholder="e.g., Dark mode for dashboard"
            className={errors.title ? 'error' : ''}
            maxLength={255}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange('description')}
            placeholder="Describe your feature request in detail..."
            rows={4}
            className={errors.description ? 'error' : ''}
            maxLength={1000}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
          <small className="char-count">
            {formData.description.length}/1000 characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="authorName">Your Name *</label>
          <input
            id="authorName"
            type="text"
            value={formData.authorName}
            onChange={handleInputChange('authorName')}
            placeholder="Your name or username"
            className={errors.authorName ? 'error' : ''}
            maxLength={100}
          />
          {errors.authorName && <span className="error-text">{errors.authorName}</span>}
        </div>

        <button 
          type="submit" 
          className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feature Request'}
        </button>
      </form>
    </div>
  );
};