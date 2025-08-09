import React, { useState } from 'react';
import { Feature } from '../types/Feature';

interface FeatureCardProps {
  feature: Feature;
  onVote: (featureId: number) => Promise<void>;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, onVote }) => {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    try {
      setIsVoting(true);
      await onVote(feature.id);
    } catch (error) {
      console.error('Vote failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="feature-card">
      <div className="feature-content">
        <div className="feature-header">
          <h3 className="feature-title">{feature.title}</h3>
          <div className="vote-section">
            <button 
              className={`vote-button ${isVoting ? 'voting' : ''}`}
              onClick={handleVote}
              disabled={isVoting}
            >
              {isVoting ? '...' : '👍'}
            </button>
            <span className="vote-count">{feature.votes}</span>
          </div>
        </div>
        
        <p className="feature-description">{feature.description}</p>
        
        <div className="feature-meta">
          <span className="author">By: {feature.authorName}</span>
          <span className="date">{formatDate(feature.created_at)}</span>
        </div>
      </div>
    </div>
  );
};