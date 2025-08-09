import { useState, useEffect, useCallback } from 'react';
import { Feature, CreateFeatureRequest } from '../types/Feature';
import { apiService } from '../services/api';

export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllFeatures();
      setFeatures(data.sort((a, b) => b.votes - a.votes)); // Sort by votes desc
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFeature = async (featureData: CreateFeatureRequest) => {
    try {
      setError(null);
      const newFeature = await apiService.createFeature(featureData);
      setFeatures(prev => [newFeature, ...prev]);
      return newFeature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create feature');
      throw err;
    }
  };

  const voteForFeature = async (featureId: number) => {
    try {
      setError(null);
      const updatedFeature = await apiService.voteForFeature(featureId);
      setFeatures(prev => 
        prev
          .map(feature => 
            feature.id === featureId ? updatedFeature : feature
          )
          .sort((a, b) => b.votes - a.votes)
      );
      return updatedFeature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote');
      throw err;
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  return {
    features,
    loading,
    error,
    createFeature,
    voteForFeature,
    refetchFeatures: fetchFeatures,
  };
};