import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import MyPosts from './pages/MyPosts';


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/post" element={<PostDetails />} />
      <Route path="/my-posts" element={<MyPosts />} />
      <Route path="*" element={<div>404 - Page not found</div>} />
    </Routes>
  );
};

export default App;
