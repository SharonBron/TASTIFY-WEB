import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { usePosts } from '../context/PostsContext';
import ReviewCard from '../components/ReviewCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const POSTS_PER_PAGE = 5;

const MyPosts: React.FC = () => {
  const { posts, setPosts } = usePosts();
  const currentUserId = '123'; // בעתיד יגיע מ־Auth

  const myPosts = posts.filter(post => post.userId === currentUserId);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const handleEdit = (id: number) => {
    alert(`Open edit modal for post ID: ${id}`);
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>My Posts</Typography>

        {myPosts.length === 0 ? (
          <Typography>No posts yet.</Typography>
        ) : (
          <>
            {myPosts.slice(0, visibleCount).map(post => (
              <Box key={post.id} sx={{ position: 'relative', mb: 3 }}>
                <ReviewCard
                  id={post.id}
                  username={post.username}
                  userImage={post.userImage}
                  restaurantImage={post.restaurantImage}
                  content={post.content}
                  rating={post.rating}
                  likes={post.likes}
                  commentsCount={post.comments.length}
                  restaurantName={post.restaurantName}
                  restaurantLocation={post.restaurantLocation}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(post.id)}>Edit</Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(post.id)}>Delete</Button>
                </Box>
              </Box>
            ))}

            {visibleCount < myPosts.length && (
              <Box textAlign="center" mt={3}>
                <Button variant="outlined" onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}>
                  Load More
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default MyPosts;
