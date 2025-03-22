import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Comment = {
  id: number;
  user: string;
  text: string;
};

export type Post = {
    id: number;
    username: string;
    userImage: string;
    restaurantImage: string;
    restaurantName: string;
    restaurantLocation: string;
    content: string;
    rating: number;
    likes: number;
    comments: Comment[];
    userId: string;
  };
  
  

type PostsContextType = {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) throw new Error("usePosts must be used within PostsProvider");
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
