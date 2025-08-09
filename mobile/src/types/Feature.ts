export interface Feature {
  id: number;
  title: string;
  description: string | null;
  authorName: string;
  votes: number;
  voteCount?: number;
  createdAt: string;
  updatedAt: string;
}