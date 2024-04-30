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
  title: String;
  intro: String;
  image: String;
  video?: String;
  createdAt: string;
  category: string;
  content: String;
  liked: boolean;
  userId: number;
  comments: [];
};

export type Comments = {
  id: number;
  newsId: number;
  userId: number;
  content: string;
};