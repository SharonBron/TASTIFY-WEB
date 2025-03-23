import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Rating,
} from '@mui/material';
import { usePosts } from '../context/PostsContext';
import ReviewCard from '../components/ReviewCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddReviewModal from '../components/AddReviewModal';
import axios from 'axios';

const POSTS_PER_PAGE = 5;

const MyPosts: React.FC = () => {
  const { posts, setPosts } = usePosts();
  const currentUserId = localStorage.getItem('userId');
  
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // ✅ טוען פוסטים רק של המשתמש המחובר
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    if (currentUserId) {
      fetchUserPosts();
    }
  }, [currentUserId, setPosts]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(prev => prev.filter(post => post._id !== id));
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedData: {
    content: string;
    rating: number;
    image?: string;
    restaurantName: string;
    restaurantLocation: string;
  }) => {
    if (!selectedPost) return;
    setPosts(prev =>
      prev.map(post =>
        post._id === selectedPost._id
          ? {
              ...post,
              text: updatedData.content,
              rating: updatedData.rating,
              images: updatedData.image ? [updatedData.image] : post.images,
              restaurantName: updatedData.restaurantName,
            }
          : post
      )
    );
    setIsEditModalOpen(false);
    setSelectedPost(null);
  };

  // סינון פוסטים (לא חובה כאן כי כבר הבאנו רק של המשתמש)
  const filteredPosts = posts.filter(
    post =>
      post.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRating === null || post.rating === selectedRating)
  );

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>My Posts</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <Typography>Filter by Rating:</Typography>
          <Rating
            value={selectedRating}
            onChange={(_, newValue) => setSelectedRating(newValue)}
          />
          {selectedRating !== null && (
            <Button size="small" onClick={() => setSelectedRating(null)}>
              Clear
            </Button>
          )}
        </Box>

        {filteredPosts.length === 0 ? (
          <Typography>No posts found.</Typography>
        ) : (
          <>
            {filteredPosts.slice(0, visibleCount).map(post => (
              <Box key={post._id} sx={{ position: 'relative', mb: 3 }}>
                <ReviewCard
                  id={post._id}
                  username={post.userId?.username || 'Unknown'}
                  userImage={post.userId?.profileImage || ''}
                  restaurantImage={post.images?.[0] || ''}
                  restaurantName={post.restaurantName}
                  restaurantLocation=""
                  content={post.text}
                  rating={post.rating}
                  likes={post.likes?.length || 0}
                  commentsCount={0}
                />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(post)}>Edit</Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(post._id)}>Delete</Button>
                </Box>
              </Box>
            ))}

            {visibleCount < filteredPosts.length && (
              <Box textAlign="center" mt={3}>
                <Button variant="outlined" onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}>
                  Load More
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>

      {selectedPost && (
        <AddReviewModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPost(null);
          }}
          onSubmit={handleUpdate}
          defaultValues={{
            content: selectedPost.text,
            rating: selectedPost.rating,
            image: selectedPost.images?.[0] || '',
            restaurantName: selectedPost.restaurantName,
            restaurantLocation: '',
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default MyPosts;
