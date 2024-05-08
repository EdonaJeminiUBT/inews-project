export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = {
  email: string;
  password: string;
  name: string;
};
export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  news: [];
  comments: [];
};
export type News = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: 'movies' | 'celebrities' | 'books' | 'general' | 'politics' | 'social_media' | 'weather';
  user_id: number;
  created_at: string;
  userName: string; 
}


export type Comments = {
  id: number;
  newsId: number;
  userId: number;
  content: string;
};