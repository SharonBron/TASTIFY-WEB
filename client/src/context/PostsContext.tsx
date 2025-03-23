import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Post = {
  _id: string;
  restaurantName: string;
  text: string;
  rating: number;
  images: string[];
  likes: string[];
  userId: {
    _id: string;
    username: string;
    profileImage: string;
  };
  createdAt: string;
};

type PostsContextType = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts must be used within PostsProvider');
  return context;
};

export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostsContext.Provider>
  );
};