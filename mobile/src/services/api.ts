import { Feature } from '../types/Feature';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL; // Change for production

export interface CreateFeatureRequest {
  title: string;
  description: string | null;
  authorName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      
      if (!error.message.includes('HTTP')) {
        // Network or other error
        throw new Error('Network error - please check your connection');
      }
      
      throw error;
    }
  }

  async getFeatures(): Promise<ApiResponse<Feature[]>> {
    return this.request<Feature[]>('/features');
  }

  async createFeature(featureData: CreateFeatureRequest): Promise<ApiResponse<Feature>> {
    return this.request<Feature>('/features', {
      method: 'POST',
      body: JSON.stringify(featureData),
    });
  }

  async voteForFeature(featureId: number): Promise<ApiResponse<Feature>> {
    return this.request<Feature>(`/features/${featureId}/vote`, {
      method: 'POST',
    });
  }

  async getFeature(featureId: number): Promise<ApiResponse<Feature>> {
    return this.request<Feature>(`/features/${featureId}`);
  }
}

export const apiService = new ApiService();