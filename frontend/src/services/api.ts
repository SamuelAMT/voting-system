import axios from 'axios';
import { Feature, CreateFeatureRequest, ApiResponse } from '../types/Feature';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get all features
  getAllFeatures: async (): Promise<Feature[]> => {
    try {
      const response = await api.get<ApiResponse<Feature[]>>('/features');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching features:', error);
      throw new Error('Failed to fetch features');
    }
  },

  // Create new feature
  createFeature: async (feature: CreateFeatureRequest): Promise<Feature> => {
    try {
      const response = await api.post<ApiResponse<Feature>>('/features', feature);
      return response.data.data;
    } catch (error) {
      console.error('Error creating feature:', error);
      throw new Error('Failed to create feature');
    }
  },

  // Vote for a feature
  voteForFeature: async (featureId: number): Promise<Feature> => {
    try {
      const response = await api.post<ApiResponse<Feature>>(`/features/${featureId}/vote`);
      return response.data.data;
    } catch (error) {
      console.error('Error voting for feature:', error);
      throw new Error('Failed to vote for feature');
    }
  },

  // Get single feature
  getFeature: async (featureId: number): Promise<Feature> => {
    try {
      const response = await api.get<ApiResponse<Feature>>(`/features/${featureId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching feature:', error);
      throw new Error('Failed to fetch feature');
    }
  },
};

export default api;