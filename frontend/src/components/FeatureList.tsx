import React from 'react';
import { Feature } from '../types/Feature';
import { FeatureCard } from './FeatureCard';

interface FeatureListProps {
  features: Feature[];
  loading: boolean;
  error: string | null;
  onVote: (featureId: number) => Promise<void>;
}

export const FeatureList: React.FC<FeatureListProps> = ({ 
  features, 
  loading, 
  error, 
  onVote 
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading features...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">❌ {error}</p>
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div className="empty-state">
        <h3>No features yet!</h3>
        <p>Be the first to submit a feature request.</p>
      </div>
    );
  }

  return (
    <div className="feature-list">
      <div className="feature-list-header">
        <h2>Feature Requests ({features.length})</h2>
        <p className="sort-info">Sorted by most votes</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            onVote={onVote}
          />
        ))}
      </div>
    </div>
  );
};