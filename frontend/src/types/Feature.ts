export interface Feature {
  id: number;
  title: string;
  description: string;
  authorName: string;
  votes: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFeatureRequest {
  title: string;
  description: string;
  authorName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}