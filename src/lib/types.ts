export type Category = {
  slug: string;
  name: string;
};

export type Comment = {
  id: string;
  author: string;
  body: string;
  postedAt: string; // ISO string
};

export type Video = {
  id: string;
  title: string;
  channel: string;
  views: number;
  uploadedAt: string; // ISO string
  durationSeconds: number;
  category: string; // Category slug
  tags: string[];
  thumbnailGradient: string;
  description: string;
  comments: Comment[];
};

